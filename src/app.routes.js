// Import express Router
const { Router } = require("express");
// Import auth module router
const { AuthRouter } = require("./modules/auth/auth.routes");
// Import user module router
const { UserRouter } = require("./modules/user/user.routes");
// Import category module router
const { CategoryRouter } = require("./modules/category/category.routes");
// Import option module router
const { OptionRouter } = require("./modules/option/option.routes");
// Import post module router
const { PostRouter } = require("./modules/post/post.routes");

// Create the root router
const mainRouter = Router();

// Health check endpoint
mainRouter.get("/health", (req, res) =>
  res.json({ status: "ok", uptime: process.uptime() }),
);

// Mount auth routes under /auth
mainRouter.use("/auth", AuthRouter);
// Mount user routes under /user
mainRouter.use("/user", UserRouter);
// Mount category routes under /category
mainRouter.use("/category", CategoryRouter);
// Mount option routes under /option
mainRouter.use("/option", OptionRouter);
// Mount post routes under /post
mainRouter.use("/post", PostRouter);

// Export the root router
module.exports = mainRouter;
