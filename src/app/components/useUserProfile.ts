import { useEffect, useState } from "react";

export interface UserProfile {
  name: string;
  role: string;
  plant: string;
}

const STORAGE_KEY = "oracle-user-profile";

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.name && parsed.role && parsed.plant) {
        return parsed as UserProfile;
      }
    } catch {
      // corrupt data — treat as first-time
    }
    return null;
  });

  const saveProfile = (p: UserProfile) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    setProfile(p);
  };

  const clearProfile = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
  };

  return { profile, saveProfile, clearProfile };
}

/** Helper: get initials from a full name */
export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");
}
