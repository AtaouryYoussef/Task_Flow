import { useCallback, useState } from 'react';
import HeaderMUI from '../components/HeaderMUI';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import ProjectForm from '../components/ProjectForm';
import useProjects from '../hooks/useProjects';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { projects, columns, loading, saving, error, addProject, renameProject, deleteProject } =
    useProjects();

  const handleRename = useCallback(
    (project: { id: string; name: string; color: string }) => {
      void renameProject(project);
    },
    [renameProject]
  );

  const handleDelete = useCallback(
    (id: string) => {
      void deleteProject(id);
    },
    [deleteProject]
  );

  if (loading) return <div className={styles.loading}>Chargement...</div>;

  return (
    <div className={styles.layout}>
      <HeaderMUI title="TaskFlow" onMenuClick={() => setSidebarOpen((p) => !p)} />
      <div className={styles.body}>
        <Sidebar projects={projects} isOpen={sidebarOpen} onRename={handleRename} onDelete={handleDelete} />
        <div className={styles.content} style={{ marginLeft: sidebarOpen ? 240 : 0 }}>
          <div className={styles.toolbar}>
            {error && <div className={styles.error}>{error}</div>}
            {!showForm ? (
              <button className={styles.addBtn} onClick={() => setShowForm(true)} disabled={saving}>
                + Nouveau projet
              </button>
            ) : (
              <ProjectForm
                submitLabel="Creer"
                onSubmit={async (name, color) => {
                  const ok = await addProject(name, color);
                  if (ok) setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            )}
          </div>
          <MainContent columns={columns} />
        </div>
      </div>
    </div>
  );
}
