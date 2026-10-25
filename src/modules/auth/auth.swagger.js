/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication module (OTP based login)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SendOTP:
 *       type: object
 *       required: [mobile]
 *       properties:
 *         mobile:
 *           type: string
 *           example: "09120000000"
 *     CheckOTP:
 *       type: object
 *       required: [mobile, code]
 *       properties:
 *         mobile:
 *           type: string
 *           example: "09120000000"
 *         code:
 *           type: string
 *           example: "12345"
 */

/**
 * @swagger
 * /auth/send-otp:
 *   post:
 *     summary: Send an OTP code to the given mobile number
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema: { $ref: '#/components/schemas/SendOTP' }
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SendOTP' }
 *     responses:
 *       200: { description: OTP sent }
 *       400: { description: OTP not expired yet }
 *       429: { description: Too many requests }
 */

/**
 * @swagger
 * /auth/check-otp:
 *   post:
 *     summary: Verify OTP and login (sets access_token cookie)
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema: { $ref: '#/components/schemas/CheckOTP' }
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CheckOTP' }
 *     responses:
 *       200: { description: Logged in }
 *       401: { description: Invalid or expired code }
 */

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout the current user
 *     tags: [Auth]
 *     responses:
 *       200: { description: Logged out }
 *       401: { description: Unauthorized }
 */
