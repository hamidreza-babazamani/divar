/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCategory:
 *       type: object
 *       required: [name, icon]
 *       properties:
 *         name: { type: string }
 *         slug: { type: string }
 *         icon: { type: string }
 *         parent: { type: string }
 */

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create a category (admin only)
 *     tags: [Category]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateCategory' }
 *     responses:
 *       201: { description: Created }
 *       403: { description: Forbidden }
 *   get:
 *     summary: List root categories
 *     tags: [Category]
 *     responses:
 *       200: { description: List }
 */

/**
 * @swagger
 * /category/{slug}:
 *   get:
 *     summary: Get a category by slug
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Found }
 *       404: { description: Not found }
 */

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Delete a category tree (admin only)
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Deleted }
 *       403: { description: Forbidden }
 */
