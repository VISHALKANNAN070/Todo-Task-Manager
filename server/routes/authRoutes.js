import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import verifyToken from "../auth/verifyToken.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);


router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  
  (req, res) => {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "6h",
    });
    
    res.cookie("token", token, {
      httpOnly: true,
      secure:false,
      sameSite: "lax",
      maxAge: 6 * 60 * 60 * 1000,
    });
    
    res.redirect("https://todo-task-manager-one.vercel.app/");
  }
);

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "6h",
    });
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set true in production with HTTPS
      sameSite: "lax",
      maxAge: 6 * 60 * 60 * 1000,
    });
    
    res.redirect("https://todo-task-manager-one.vercel.app/");
  }
);

router.get("/user",verifyToken,(req,res)=>{
  res.status(200).json({userId:req.user._id})
})

router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure:false,
  });
  res.status(200).json({message:"Logout Successful"})
});

export default router;
