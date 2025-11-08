import FileVerification from '../models/FileVerification.js';
import User from '../models/User.js';
import { analyzeFile, quickScan, generateReport } from '../services/geminiService.js';
import { deleteFile } from '../config/multer.js';
import path from 'path';

/**
 * @desc    Upload and verify a file
 * @route   POST /api/verify/upload
 * @access  Private
 */
export const uploadAndVerify = async (req, res) => {
  const startTime = Date.now();

  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    const { quickScanOnly } = req.body;

    // Create verification record
    const verification = await FileVerification.create({
      user: req.user.id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      fileType: path.extname(req.file.originalname).toLowerCase(),
      mimeType: req.file.mimetype,
      filePath: req.file.path,
      status: 'processing',
    });

    // Perform analysis based on scan type
    let analysisResult;
    
    try {
      if (quickScanOnly === 'true') {
        // Quick scan
        const quickResult = await quickScan(
          req.file.path,
          req.file.originalname,
          req.file.mimetype
        );
        
        analysisResult = {
          isAuthentic: quickResult.isAuthentic,
          confidenceScore: quickResult.confidenceScore,
          riskLevel: quickResult.riskLevel,
          detectedIssues: [],
          analysis: quickResult.summary,
          recommendations: ['For detailed analysis, perform a full scan'],
          metadata: { scanType: 'quick' },
        };
      } else {
        // Full analysis
        const fullAnalysis = await analyzeFile(
          req.file.path,
          req.file.originalname,
          req.file.mimetype
        );
        
        analysisResult = fullAnalysis.data;
        verification.geminiResponse = fullAnalysis.rawResponse;
      }

      // Update verification record with results
      verification.status = 'completed';
      verification.verificationResult = analysisResult;
      verification.processingTime = Date.now() - startTime;

      await verification.save();

      // Update user verification count
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { verificationCount: 1 },
      });

      // Delete the uploaded file after successful verification
      if (req.file && req.file.path) {
        deleteFile(req.file.path);
        console.log(`File deleted after verification: ${req.file.path}`);
      }

      res.status(200).json({
        success: true,
        message: 'File verified successfully',
        data: {
          verification: {
            id: verification._id,
            fileName: verification.originalName,
            fileType: verification.fileType,
            fileSize: verification.fileSize,
            status: verification.status,
            verificationResult: verification.verificationResult,
            processingTime: verification.processingTime,
            createdAt: verification.createdAt,
          },
        },
      });
    } catch (analysisError) {
      // Update verification with error
      verification.status = 'failed';
      verification.errorMessage = analysisError.message;
      verification.processingTime = Date.now() - startTime;
      await verification.save();

      // Delete the uploaded file even on analysis error
      if (req.file && req.file.path) {
        deleteFile(req.file.path);
        console.log(`File deleted after failed verification: ${req.file.path}`);
      }

      throw analysisError;
    }
  } catch (error) {
    console.error('Upload and verify error:', error);

    // Clean up uploaded file on error
    if (req.file && req.file.path) {
      deleteFile(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Error processing file verification',
      error: error.message,
    });
  }
};

/**
 * @desc    Get verification history for user
 * @route   GET /api/verify/history
 * @access  Private
 */
export const getVerificationHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, riskLevel } = req.query;

    // Build filter
    const filter = { user: req.user.id };
    if (status) filter.status = status;
    if (riskLevel) filter['verificationResult.riskLevel'] = riskLevel;

    // Get verifications
    const verifications = await FileVerification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-geminiResponse -filePath'); // Exclude sensitive data

    const total = await FileVerification.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        verifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching verification history',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single verification by ID
 * @route   GET /api/verify/:id
 * @access  Private
 */
export const getVerification = async (req, res) => {
  try {
    console.log('Fetching verification with ID:', req.params.id);
    console.log('Requested by user:', req.user.id);
    
    const verification = await FileVerification.findById(req.params.id);

    if (!verification) {
      console.log('Verification not found in database for ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Verification not found',
      });
    }

    console.log('Verification found, owner:', verification.user.toString());
    
    // Check if user owns this verification
    if (verification.user.toString() !== req.user.id && req.user.role !== 'admin') {
      console.log('Authorization failed: user does not own this verification');
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this verification',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        verification,
      },
    });
  } catch (error) {
    console.error('Get verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching verification',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete verification
 * @route   DELETE /api/verify/:id
 * @access  Private
 */
export const deleteVerification = async (req, res) => {
  try {
    const verification = await FileVerification.findById(req.params.id);

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification not found',
      });
    }

    // Check if user owns this verification
    if (verification.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this verification',
      });
    }

    // Try to delete file from disk (file may already be deleted after verification)
    try {
      if (verification.filePath) {
        deleteFile(verification.filePath);
        console.log(`File deleted: ${verification.filePath}`);
      }
    } catch (fileError) {
      // File may already be deleted, just log and continue
      console.log(`File already deleted or not found: ${verification.filePath}`);
    }

    // Delete verification record
    await verification.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Verification deleted successfully',
    });
  } catch (error) {
    console.error('Delete verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting verification',
      error: error.message,
    });
  }
};

/**
 * @desc    Get verification statistics
 * @route   GET /api/verify/stats
 * @access  Private
 */
export const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalVerifications = await FileVerification.countDocuments({ user: userId });
    const completedVerifications = await FileVerification.countDocuments({
      user: userId,
      status: 'completed',
    });
    const failedVerifications = await FileVerification.countDocuments({
      user: userId,
      status: 'failed',
    });

    // Count authentic vs suspicious files
    const authenticFiles = await FileVerification.countDocuments({
      user: userId,
      status: 'completed',
      'verificationResult.isAuthentic': true,
    });

    const suspiciousFiles = await FileVerification.countDocuments({
      user: userId,
      status: 'completed',
      'verificationResult.isAuthentic': false,
    });

    // Risk level breakdown
    const riskLevels = await FileVerification.aggregate([
      { $match: { user: req.user._id, status: 'completed' } },
      {
        $group: {
          _id: '$verificationResult.riskLevel',
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent activity
    const recentVerifications = await FileVerification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('originalName status verificationResult createdAt');

    res.status(200).json({
      success: true,
      data: {
        stats: {
          total: totalVerifications,
          completed: completedVerifications,
          failed: failedVerifications,
          authentic: authenticFiles,
          suspicious: suspiciousFiles,
          riskLevels: riskLevels.reduce((acc, curr) => {
            acc[curr._id || 'unknown'] = curr.count;
            return acc;
          }, {}),
        },
        recentActivity: recentVerifications,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};

/**
 * @desc    Generate detailed report for verification
 * @route   GET /api/verify/:id/report
 * @access  Private
 */
export const getDetailedReport = async (req, res) => {
  try {
    const verification = await FileVerification.findById(req.params.id);

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification not found',
      });
    }

    // Check authorization
    if (verification.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this report',
      });
    }

    // Generate report using Gemini
    const reportData = {
      fileName: verification.originalName,
      fileType: verification.fileType,
      fileSize: verification.fileSize,
      verificationDate: verification.createdAt,
      result: verification.verificationResult,
      processingTime: verification.processingTime,
    };

    const report = await generateReport(reportData);

    res.status(200).json({
      success: true,
      data: {
        report,
        verification: reportData,
      },
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating report',
      error: error.message,
    });
  }
};
