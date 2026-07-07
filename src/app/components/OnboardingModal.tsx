import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, User, Briefcase, MapPin, ArrowRight } from "lucide-react";
import type { UserProfile } from "./useUserProfile";
import { plants } from "./data";

export function OnboardingModal({
  open,
  onComplete,
}: {
  open: boolean;
  onComplete: (profile: UserProfile) => void;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [plant, setPlant] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!role.trim()) {
      setError("Please enter your role");
      return;
    }
    if (!plant) {
      setError("Please select your workplace");
      return;
    }
    setError("");
    onComplete({ name: name.trim(), role: role.trim(), plant });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          {/* Backdrop blur layer */}
          <div
            className="absolute inset-0"
            style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md mx-4"
          >
            {/* Glass card */}
            <div
              className="rounded-3xl border p-8 shadow-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.65) 100%)",
                borderColor: "rgba(255,255,255,0.3)",
                backdropFilter: "blur(20px) saturate(1.8)",
                WebkitBackdropFilter: "blur(20px) saturate(1.8)",
                boxShadow:
                  "0 24px 80px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)",
              }}
            >
              {/* Header */}
              <div className="flex flex-col items-center mb-8">
                <div
                  className="grid place-items-center rounded-2xl mb-4"
                  style={{
                    width: 56,
                    height: 56,
                    background: "linear-gradient(135deg, #3F6E52 0%, #5a9e72 100%)",
                    boxShadow: "0 4px 16px rgba(63,110,82,0.3)",
                  }}
                >
                  <Activity size={26} color="white" />
                </div>
                <h2
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#1A1A1A",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Welcome to Oracle
                </h2>
                <p
                  className="mt-2 text-center"
                  style={{
                    fontSize: 14,
                    color: "#666",
                    maxWidth: 280,
                    lineHeight: 1.5,
                  }}
                >
                  Set up your profile to personalize your predictive maintenance
                  dashboard.
                </p>
              </div>

              {/* Form */}
              <div className="flex flex-col gap-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="onboarding-name"
                    className="flex items-center gap-2 mb-2"
                    style={{ fontSize: 13, fontWeight: 600, color: "#333" }}
                  >
                    <User size={14} />
                    Full name
                  </label>
                  <input
                    id="onboarding-name"
                    type="text"
                    placeholder="e.g. Frank Okoh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                    style={{
                      border: "1px solid rgba(0,0,0,0.1)",
                      background: "rgba(255,255,255,0.7)",
                      color: "#1A1A1A",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3F6E52";
                      e.target.style.boxShadow = "0 0 0 3px rgba(63,110,82,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(0,0,0,0.1)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                {/* Role */}
                <div>
                  <label
                    htmlFor="onboarding-role"
                    className="flex items-center gap-2 mb-2"
                    style={{ fontSize: 13, fontWeight: 600, color: "#333" }}
                  >
                    <Briefcase size={14} />
                    Role
                  </label>
                  <input
                    id="onboarding-role"
                    type="text"
                    placeholder="e.g. Plant Manager"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                    style={{
                      border: "1px solid rgba(0,0,0,0.1)",
                      background: "rgba(255,255,255,0.7)",
                      color: "#1A1A1A",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3F6E52";
                      e.target.style.boxShadow = "0 0 0 3px rgba(63,110,82,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(0,0,0,0.1)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                {/* Plant / Workplace dropdown */}
                <div>
                  <label
                    htmlFor="onboarding-plant"
                    className="flex items-center gap-2 mb-2"
                    style={{ fontSize: 13, fontWeight: 600, color: "#333" }}
                  >
                    <MapPin size={14} />
                    Workplace
                  </label>
                  <select
                    id="onboarding-plant"
                    value={plant}
                    onChange={(e) => setPlant(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all cursor-pointer appearance-none"
                    style={{
                      border: "1px solid rgba(0,0,0,0.1)",
                      background: "rgba(255,255,255,0.7)",
                      color: plant ? "#1A1A1A" : "#999",
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23666' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3F6E52";
                      e.target.style.boxShadow = "0 0 0 3px rgba(63,110,82,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(0,0,0,0.1)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <option value="" disabled>
                      Select your plant…
                    </option>
                    {plants.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} — {p.location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Error */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: 13, color: "#e5484d", fontWeight: 500 }}
                  >
                    {error}
                  </motion.p>
                )}

                {/* Submit */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center justify-center gap-2 w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all cursor-pointer mt-2"
                  style={{
                    background: "linear-gradient(135deg, #3F6E52 0%, #4a8a62 100%)",
                    boxShadow: "0 4px 16px rgba(63,110,82,0.25)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(63,110,82,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(63,110,82,0.25)";
                  }}
                >
                  Get Started
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
