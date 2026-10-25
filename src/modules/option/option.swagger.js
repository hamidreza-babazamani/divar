/**
 * @swagger
 * tags:
 *   name: Option
 *   description: Category options management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateOption:
 *       type: object
 *       required: [title, key, type, category]
 *       properties:
 *         title: { type: string }
 *         key: { type: string }
 *         category: { type: string }
 *         guid: { type: string }
 *         required: { type: boolean }
 *         type: { type: string, enum: [number, string, boolean, array] }
 *         enum: { type: array, items: { type: string } }
 *     UpdateOption:
 *       type: object
 *       properties:
 *         title: { type: string }
 *         key: { type: string }
 *         category: { type: string }
 *         guid: { type: string }
 *         required: { type: boolean }
 *         type: { type: string, enum: [number, string, boolean, array] }
 *         enum: { type: array, items: { type: string } }
 */

/**
 * @swagger
 * /option:
 *   post:
 *     summary: Create an option (admin only)
 *     tags: [Option]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateOption' }
 *     responses:
 *       201: { description: Created }
 *   get:
 *     summary: List options with pagination
 *     tags: [Option]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Paginated list }
 */

/**
 * @swagger
 * /option/{id}:
 *   put:
 *     summary: Update an option (admin only)
 *     tags: [Option]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateOption' }
 *     responses:
 *       200: { description: Updated }
 *   get:
 *     summary: Get an option by id
 *     tags: [Option]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Found }
 *   delete:
 *     summary: Delete an option (admin only)
 *     tags: [Option]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Deleted }
 */

/**
 * @swagger
 * /option/by-category/{categoryId}:
 *   get:
 *     summary: Get options of a category by id
 *     tags: [Option]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: List }
 */

/**
 * @swagger
 * /option/by-category-slug/{slug}:
 *   get:
 *     summary: Get options of a category by slug
 *     tags: [Option]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: List }
 */
