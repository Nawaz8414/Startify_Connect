import { motion } from "framer-motion";
import "./common.css";

const data = [
  {
    icon: "🚀",
    title: "Launch Your Startup",
    desc: "Share your ideas and launches with a community that cares."
  },
  {
    icon: "🤝",
    title: "Connect & Collaborate",
    desc: "Find co-founders, mentors, and early adopters."
  },
  {
    icon: "💬",
    title: "Direct Messaging",
    desc: "Real-time conversations with founders. No middlemen."
  },
  {
    icon: "✨",
    title: "AI Co-Founder",
    desc: "Your personal startup assistant for insights."
  }
];

export default function Features() {
  return (
    <section className="features container">
      <h2>Everything You Need to Connect</h2>
      <p>From posting your launch to finding your co-founder.</p>

      <div className="feature-grid">
        {data.map((f, i) => (
          <motion.div
            className="feature-card"
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            viewport={{ once: true }}
          >
            <div className="feature-icon">{f.icon}</div>
            <h4>{f.title}</h4>
            <p>{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
