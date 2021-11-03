const express = require("express");
const router = express.Router();
const { Goal, Note } = require("../../models");

//get all goal posts

router.get("/", (req, res) => {
  Goal.findAll().then(goalData => {
    res.json(goalData);
  }).catch(err=>{
    console.log(err);
    res.status(500).json({ err: "an error occurred" });
  })
});

//create a goal post

router.post("/", (req, res) => {
  Goal.create({
      content: req.body.content,
      note_id: req.body.note_id,
    }).then(newGoal=>{
      res.status(200).json(goal);
    }).catch(err=> {
      console.log(err);
      res.status(500).json({ err: "an error occurred" });
    })
});

//update one goal post

router.put("/:id", (req, res) => {
  if (!req.session.user) {
    return res.status(403).json({ err: "not logged in" });
  }
  Goal.findByPk(req.params.id)
    .then((found) => {
      Note.findByPk(found.note_id).then((foundNote) => {
        if (foundNote.user_id !== req.session.user.id) {
          return res.status(403).json({ err: "not your goal" });
        }
        Goal.update(
          {
            content: req.body.content,
          },
          {
            where: {
              id: req.params.id,
            },
          }
        )
          .then((updateData) => {
            if (updateData[0]) {
              res.status(200).json(updateData);
            } else {
              res.status(404).json({ err: "no goal found to update" });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ err: "an error occurred" });
          });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err: "an error occurred" });
    });
});

//delete one goal post

router.delete("/:id", (req, res) => {
  if (!req.session.user) {
    return res.status(403).json({ err: "not logged in" });
  }
  Goal.findByPk(req.params.id)
    .then((found) => {
      Note.findByPk(found.note_id).then((foundNote) => {
        if (foundNote.user_id !== req.session.user.id) {
          return res.status(403).json({ err: "not your goal" });
        }
        Goal.destroy({
          where: {
            id: req.params.id,
          },
        })
          .then((deleted) => {
            if (deleted) {
              res.status(200).json(deleted);
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({err: "an error occurred"});
          });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err: "an error occurred" });
    });
});

module.exports = router;
