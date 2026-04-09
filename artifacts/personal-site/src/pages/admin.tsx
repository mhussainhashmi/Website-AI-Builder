import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const API_BASE = "/api";

type Project = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
};

type ContactMsg = {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

function apiHeaders(password: string) {
  return { "Content-Type": "application/json", "x-admin-password": password };
}

async function apiFetch(path: string, password: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...apiHeaders(password), ...(options?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

const emptyForm = {
  title: "",
  description: "",
  tags: "",
  liveUrl: "",
  repoUrl: "",
  imageUrl: "",
  featured: false,
};

export default function AdminPage() {
  const [password, setPassword] = useState(() => sessionStorage.getItem("admin_pw") ?? "");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<"projects" | "messages">("projects");

  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    try {
      await apiFetch("/admin/projects", password);
      sessionStorage.setItem("admin_pw", password);
      setAuthed(true);
    } catch {
      setAuthError("Wrong password. Try again.");
    }
  }

  async function loadProjects() {
    setLoading(true);
    try {
      const data = await apiFetch("/admin/projects", password);
      setProjects(data as Project[]);
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages() {
    setLoading(true);
    try {
      const data = await apiFetch("/admin/contacts", password);
      setMessages(data as ContactMsg[]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authed) return;
    if (tab === "projects") loadProjects();
    else loadMessages();
  }, [authed, tab]);

  function openNew() {
    setForm(emptyForm);
    setEditId(null);
    setFormError("");
    setFormOpen(true);
  }

  function openEdit(p: Project) {
    setForm({
      title: p.title,
      description: p.description,
      tags: p.tags.join(", "),
      liveUrl: p.liveUrl ?? "",
      repoUrl: p.repoUrl ?? "",
      imageUrl: p.imageUrl ?? "",
      featured: p.featured,
    });
    setEditId(p.id);
    setFormError("");
    setFormOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    const body = {
      title: form.title,
      description: form.description,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      liveUrl: form.liveUrl || null,
      repoUrl: form.repoUrl || null,
      imageUrl: form.imageUrl || null,
      featured: form.featured,
    };
    try {
      if (editId !== null) {
        await apiFetch(`/admin/projects/${editId}`, password, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
      } else {
        await apiFetch("/admin/projects", password, {
          method: "POST",
          body: JSON.stringify(body),
        });
      }
      setFormOpen(false);
      await loadProjects();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this project?")) return;
    await apiFetch(`/admin/projects/${id}`, password, { method: "DELETE" });
    await loadProjects();
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="text-4xl font-bold mb-2">H<span className="text-primary">.</span></div>
            <h1 className="text-xl font-semibold">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your admin password to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="admin-pw">Password</label>
              <Input
                id="admin-pw"
                data-testid="input-admin-password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            {authError && (
              <p className="text-sm text-destructive">{authError}</p>
            )}
            <Button data-testid="button-admin-login" type="submit" className="w-full">
              Sign in
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-6">
            Set <code className="bg-muted px-1 rounded">ADMIN_PASSWORD</code> in environment variables
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="container max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">H<span className="text-primary">.</span></span>
            <span className="text-sm text-muted-foreground font-medium">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={tab === "projects" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTab("projects")}
              data-testid="tab-projects"
            >
              Projects
            </Button>
            <Button
              variant={tab === "messages" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTab("messages")}
              data-testid="tab-messages"
            >
              Messages
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { sessionStorage.removeItem("admin_pw"); setAuthed(false); }}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl px-6 py-10">
        {tab === "projects" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Projects</h2>
              <Button onClick={openNew} data-testid="button-add-project">+ Add project</Button>
            </div>

            {loading ? (
              <div className="text-muted-foreground text-sm">Loading...</div>
            ) : projects.length === 0 ? (
              <p className="text-muted-foreground">No projects yet.</p>
            ) : (
              <div className="space-y-3">
                {projects.map(p => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start justify-between gap-4 p-4 rounded-lg border border-border bg-card"
                    data-testid={`card-project-${p.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{p.title}</span>
                        {p.featured && <Badge variant="secondary">Featured</Badge>}
                        {p.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="outline" onClick={() => openEdit(p)} data-testid={`button-edit-${p.id}`}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)} data-testid={`button-delete-${p.id}`}>Delete</Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "messages" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Messages</h2>
            {loading ? (
              <div className="text-muted-foreground text-sm">Loading...</div>
            ) : messages.length === 0 ? (
              <p className="text-muted-foreground">No messages yet.</p>
            ) : (
              <div className="space-y-3">
                {messages.map(m => (
                  <div
                    key={m.id}
                    className="p-4 rounded-lg border border-border bg-card"
                    data-testid={`card-message-${m.id}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{m.name}</span>
                      <span className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{m.email}</p>
                    <p className="text-sm">{m.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Project form modal */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setFormOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg font-bold mb-5">{editId !== null ? "Edit project" : "New project"}</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    data-testid="input-project-title"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Description *</label>
                  <Textarea
                    data-testid="input-project-description"
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Tags <span className="text-muted-foreground font-normal">(comma-separated)</span></label>
                  <Input
                    data-testid="input-project-tags"
                    value={form.tags}
                    placeholder="React, TypeScript, AI"
                    onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Live URL</label>
                    <Input
                      data-testid="input-project-liveurl"
                      value={form.liveUrl}
                      placeholder="https://..."
                      onChange={e => setForm(f => ({ ...f, liveUrl: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Repo URL</label>
                    <Input
                      data-testid="input-project-repourl"
                      value={form.repoUrl}
                      placeholder="https://github.com/..."
                      onChange={e => setForm(f => ({ ...f, repoUrl: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Image URL</label>
                  <Input
                    data-testid="input-project-imageurl"
                    value={form.imageUrl}
                    placeholder="https://..."
                    onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    data-testid="checkbox-project-featured"
                    checked={form.featured}
                    onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Featured project</span>
                </label>

                {formError && <p className="text-sm text-destructive">{formError}</p>}

                <div className="flex gap-3 pt-2">
                  <Button data-testid="button-save-project" type="submit" disabled={saving} className="flex-1">
                    {saving ? "Saving..." : editId !== null ? "Save changes" : "Create project"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
