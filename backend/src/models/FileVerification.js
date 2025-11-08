import mongoose from 'mongoose';

const fileVerificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: false, // Not required since files are deleted after verification
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },
    verificationResult: {
      isAuthentic: {
        type: Boolean,
        default: null,
      },
      confidenceScore: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },
      riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical', null],
        default: null,
      },
      detectedIssues: [
        {
          type: {
            type: String,
            required: true,
          },
          severity: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
          location: String,
        },
      ],
      analysis: {
        type: String,
        default: null,
      },
      recommendations: [String],
      metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },
    geminiResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    processingTime: {
      type: Number, // milliseconds
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
fileVerificationSchema.index({ user: 1, createdAt: -1 });
fileVerificationSchema.index({ status: 1, createdAt: -1 });

// Virtual for report
fileVerificationSchema.virtual('report').get(function () {
  return {
    id: this._id,
    fileName: this.originalName,
    fileType: this.fileType,
    fileSize: this.fileSize,
    verificationDate: this.createdAt,
    status: this.status,
    result: this.verificationResult,
    processingTime: this.processingTime,
  };
});

// Ensure virtuals are included in JSON
fileVerificationSchema.set('toJSON', { virtuals: true });
fileVerificationSchema.set('toObject', { virtuals: true });

const FileVerification = mongoose.model('FileVerification', fileVerificationSchema);

export default FileVerification;
