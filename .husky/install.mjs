// .husky/install.mjs
// Skip hook setup on production/CI installs (Render, Vercel, etc.)
if (process.env.NODE_ENV === "production" || process.env.CI) {
  process.exit(0);
}

try {
  const husky = (await import("husky")).default;
  console.log(husky());
} catch {
  // husky isn't installed (e.g. devDependencies omitted), so don't break the install
  console.log("husky not installed, skipping git hooks setup");
}
