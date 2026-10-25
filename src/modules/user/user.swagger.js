/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile management
 */

/**
 * @swagger
 * /user/whoami:
 *   get:
 *     summary: Return the current authenticated user
 *     tags: [User]
 *     responses:
 *       200: { description: User profile }
 *       401: { description: Unauthorized }
 */

/**
 * @swagger
 * /user/edit:
 *   patch:
 *     summary: Update the current user's profile
 *     tags: [User]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName: { type: string }
 *     responses:
 *       200: { description: Updated profile }
 *       401: { description: Unauthorized }
 */
