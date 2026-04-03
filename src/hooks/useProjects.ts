import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api/axios';

interface Project {
  id: string;
  name: string;
  color: string;
}

interface Column {
  id: string;
  title: string;
  tasks: string[];
}

export default function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, colRes] = await Promise.all([api.get('/projects'), api.get('/columns')]);
        setProjects(projRes.data);
        setColumns(colRes.data);
      } catch {
        setError('Erreur chargement');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const addProject = useCallback(async (name: string, color: string) => {
    setSaving(true);
    setError(null);

    try {
      const { data } = await api.post('/projects', { name, color });
      setProjects((prev) => [...prev, data]);
      return true;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || `Erreur ${err.response?.status || ''}`.trim());
      } else {
        setError('Erreur inconnue');
      }
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const renameProject = useCallback(async (project: Project) => {
    const newName = prompt('Nouveau nom :', project.name)?.trim();
    if (!newName || newName === project.name) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const { data } = await api.put(`/projects/${project.id}`, { ...project, name: newName });
      setProjects((prev) => prev.map((item) => (item.id === project.id ? data : item)));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || `Erreur ${err.response?.status || ''}`.trim());
      } else {
        setError('Erreur inconnue');
      }
    } finally {
      setSaving(false);
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    if (!confirm('Etes-vous sur ?')) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || `Erreur ${err.response?.status || ''}`.trim());
      } else {
        setError('Erreur inconnue');
      }
    } finally {
      setSaving(false);
    }
  }, []);

  return { projects, columns, loading, saving, error, addProject, renameProject, deleteProject };
}