/**
 * @swagger
 * tags:
 *   name: Post
 *   description: Classified posts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePost:
 *       type: object
 *       required: [title_post, description, lat, lng, category]
 *       properties:
 *         title_post: { type: string }
 *         description: { type: string }
 *         amount: { type: number }
 *         category: { type: string }
 *         lat: { type: number }
 *         lng: { type: number }
 *         images:
 *           type: array
 *           items: { type: string, format: binary }
 *     UpdatePost:
 *       type: object
 *       properties:
 *         title: { type: string }
 *         content: { type: string }
 *         amount: { type: number }
 *         category: { type: string }
 */

/**
 * @swagger
 * /post:
 *   get:
 *     summary: List published posts with pagination and filters
 *     tags: [Post]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: Paginated list }
 */

/**
 * @swagger
 * /post/create:
 *   post:
 *     summary: Create a new post with up to ten images
 *     tags: [Post]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema: { $ref: '#/components/schemas/CreatePost' }
 *     responses:
 *       201: { description: Created }
 *       401: { description: Unauthorized }
 */

/**
 * @swagger
 * /post/my:
 *   get:
 *     summary: List the current user's posts
 *     tags: [Post]
 *     responses:
 *       200: { description: Paginated list }
 *       401: { description: Unauthorized }
 */

/**
 * @swagger
 * /post/statistics:
 *   get:
 *     summary: Return aggregate statistics for the current user
 *     tags: [Post]
 *     responses:
 *       200: { description: Statistics object }
 *       401: { description: Unauthorized }
 */

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Get a single post by id
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Found }
 *       404: { description: Not found }
 *   patch:
 *     summary: Update a post (owner or admin)
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdatePost' }
 *     responses:
 *       200: { description: Updated }
 *       403: { description: Forbidden }
 */

/**
 * @swagger
 * /post/delete/{id}:
 *   delete:
 *     summary: Delete a post (owner or admin)
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Deleted }
 *       403: { description: Forbidden }
 */

/**
 * @swagger
 * /post/{id}/similar:
 *   get:
 *     summary: Return similar posts for a post id
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: List }
 */
