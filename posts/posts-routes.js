const express = require("express");
const Posts = require("../data/db.js");
const route = express.Router();

route.get("/api/posts", async (req, res) => {
  try {
    const posts = await Posts.find(req.query);
    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ error: "The posts information could not be retrieved." });
  }
});

route.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);

    if (post) {
      res.status(200).json(post);
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "The post information could not be retrieved." });
  }
});

route.post("/api/posts", async (req, res) => {
  if (!req.body.contents || !req.body.title) {
    return res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
  try {
    const post = await Posts.add(req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({
      error: "There was an error while saving the post to the database"
    });
  }
});

route.delete("/api/posts/:id", async (req, res) => {
  try {
    const count = await Posts.remove(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: "Deleted post successfully." });
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch (error) {
    res.status(500).json({ error: "The post could not be removed" });
  }
});

route.put("/api/posts/:id", async (req, res) => {
  if (!req.body.contents || !req.body.title) {
    return res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
  try {
    const post = await Posts.update(req.params.id, req.body);
    if (post) {
      res.status(200).json(post);
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "The post information could not be modified." });
  }
});

route.get("/api/posts/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Posts.findById(id);
    if (post) {
      const posts = await Posts.findPostComments(id);
      res.status(200).json(posts);
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "The comments information could not be retrieved." });
  }
});

route.post("/api/posts/:id/comments", async (req, res) => {
  if (!req.body.text) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  }
  try {
    const post = await Posts.findById(req.params.id);
    if (post) {
      const commentInfo = { ...req.body, post_id: req.params.id };
      const comment = await Posts.insertComment(commentInfo);
      res.status(201).json(comment);
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error: "There was an error while saving the comment to the database"
      });
  }
});

module.exports = route;
