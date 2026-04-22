import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./common.css";

export default function Hero() {
  return (
    <section className="container hero">
      {/* LEFT CONTENT */}
      <motion.div
        className="hero-left"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="badge">● The Innovation Stream</div>

        <h1>
          Where Startups <br />
          <span>Find Their People</span>
        </h1>

        <p className="hero-sub">
          Connect with founders, discover groundbreaking projects, and be part
          of the next big thing. Your startup journey starts here.
        </p>

        {/* 🔁 Only change is here */}
        <div className="hero-buttons">
          <Link to="/auth" className="btn-primary">
            Start Connecting →
          </Link>
          <Link to="/auth" className="btn-outline">
            I have an account
          </Link>
        </div>

        <div className="hero-avatars">
          <div className="avatars">
            <img src="https://i.pravatar.cc/40?img=1" alt="" />
            <img src="https://i.pravatar.cc/40?img=2" alt="" />
            <img src="https://i.pravatar.cc/40?img=3" alt="" />
            <div className="avatar-more">+99</div>
          </div>
          <p>Join 500+ founders already building</p>
        </div>
      </motion.div>

      {/* RIGHT CONTENT */}
      <motion.div
        className="hero-right"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <div className="hero-card">
          <div className="post">
            <div className="post-head">
              <div className="post-icon"></div>
              <div>
                <h4>AI Health Tracker</h4>
                <p className="post-meta">by Sarah Chen · 2h ago</p>
              </div>
            </div>

            <p className="post-desc">
              Launching our MVP next week! Looking for early beta testers
              interested in AI-powered health insights.
            </p>

            <div className="tags">
              <span>HealthTech</span>
              <span className="green">AI</span>
            </div>
          </div>

          <div className="ai-box">
            ✨ <strong>AI Assistant</strong>
            <p>
              I found 3 fintech startups looking for developers. Want me to
              show you?
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
