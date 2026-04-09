/**
 * Standard API Response Format
 * Ensures consistent response structure across all endpoints
 */

class ApiResponse {
  constructor(statusCode, data = null, message = 'Success', errors = null) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.errors = errors;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      ...(this.errors && { errors: this.errors }),
      timestamp: this.timestamp,
    };
  }
}

/**
 * Send Success Response
 */
const sendSuccessResponse = (res, statusCode = 200, data = null, message = 'Success') => {
  const response = new ApiResponse(statusCode, data, message);
  res.status(statusCode).json(response.toJSON());
};

/**
 * Send Error Response
 */
const sendErrorResponse = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = new ApiResponse(statusCode, null, message, errors);
  res.status(statusCode).json(response.toJSON());
};

module.exports = {
  ApiResponse,
  sendSuccessResponse,
  sendErrorResponse,
};
