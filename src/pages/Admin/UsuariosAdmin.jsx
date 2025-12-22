// src/pages/Admin/UsuariosAdmin.jsx
import { useEffect, useState } from 'react';
import {
  getUsers,
  deleteUser,
  updateUser,
  getAdminStats,
  createUser,
  resendVerificationEmail, // función para reenviar email de verificación
} from '../../services/adminApi';

const INITIAL_FILTERS = {
  search: '',
  plan: 'all',
  estado: 'all',
  page: 1,
  limit: 10,
};

const UsuariosAdmin = () => {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [usersData, setUsersData] = useState({
    users: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [filterVerified, setFilterVerified] = useState('todos');

  // para trackear acciones por fila (toggle / resend)
  const [actionLoading, setActionLoading] = useState({});

  // Modal edición
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    tipoSuscripcion: 'free',
    estadoSuscripcion: 'activa',
    role: 'user',
  });
  const [saving, setSaving] = useState(false);

  // Modal crear usuario
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    nombre: '',
    email: '',
    password: '',
    empresa: '',
    tipoSuscripcion: 'free',
    estadoSuscripcion: 'activa',
    role: 'user',
  });
  const [creating, setCreating] = useState(false);

  // Confirmación eliminar
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Obtener usuarios
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiFilters = {
        page: filters.page,
        limit: filters.limit,
      };

      if (filters.search) apiFilters.search = filters.search;
      if (filters.plan !== 'all') apiFilters.plan = filters.plan;
      if (filters.estado !== 'all') apiFilters.estado = filters.estado;
      // incluir filtro de verificación solo si no es "todos"
      if (filterVerified && filterVerified !== 'todos') {
        apiFilters.verified = filterVerified; // 'verificados' | 'no_verificados'
      }

      // Llamada a la API
      const response = await getUsers(apiFilters);

      // Normalizar distintos formatos posibles de respuesta
      const payload =
        response?.data?.data || // axios full response with { data: { data: ... } }
        response?.data ||      // axios response with { data: ... }
        response || {};        // direct return

      const usuarios = payload.usuarios || payload.users || response?.users || [];
      const pagination =
        payload.pagination ||
        payload.pageData ||
        {
          page: payload.page || response?.page || filters.page,
          limit: payload.limit || response?.limit || filters.limit,
          total: payload.total || response?.total || usuarios.length,
          pages: payload.pages || response?.totalPages || 1,
        };

      setUsersData({
        users: usuarios,
        total: pagination.total || usuarios.length,
        page: pagination.page || filters.page,
        totalPages: pagination.pages || pagination.totalPages || 1,
      });
    } catch (err) {
      console.error('Error fetchUsers:', err);
      setError(
        err.response?.data?.message || 'Error al cargar usuarios de administración'
      );
    } finally {
      setLoading(false);
    }
  };

  // Obtener estadísticas
  const fetchStats = async () => {
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, filters.plan, filters.estado, filterVerified]); // <- incluir filterVerified

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      page: 1, // reset página
    }));
    fetchUsers(); // ejecutamos con el search actualizado
  };

  const handleChangeFilter = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: field === 'page' ? value : 1, // reset página cuando cambian otros filtros
    }));
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({
      tipoSuscripcion: user.tipoSuscripcion || 'free',
      estadoSuscripcion: user.estadoSuscripcion || 'activa',
      role: user.role || 'user',
    });
  };

  const closeEditModal = () => {
    setSelectedUser(null);
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    try {
      setSaving(true);
      await updateUser(selectedUser._id, editForm);
      await fetchUsers();
      closeEditModal();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || 'Error al actualizar el usuario'
      );
    } finally {
      setSaving(false);
    }
  };

  const openDeleteConfirm = (user) => {
    setUserToDelete(user);
  };

  const closeDeleteConfirm = () => {
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      setDeleting(true);
      await deleteUser(userToDelete._id);
      await fetchUsers();
      closeDeleteConfirm();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || 'Error al eliminar el usuario'
      );
    } finally {
      setDeleting(false);
    }
  };

  // Create user handlers
  const openAddModal = () => {
    setNewUserForm({
      nombre: '',
      email: '',
      password: '',
      empresa: '',
      tipoSuscripcion: 'free',
      estadoSuscripcion: 'activa',
      role: 'user',
    });
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const handleNewUserChange = (field, value) => {
    setNewUserForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateUser = async () => {
    try {
      setCreating(true);
      // Validación simple
      if (!newUserForm.nombre || !newUserForm.email || !newUserForm.password) {
        alert('Por favor completa nombre, email y contraseña');
        setCreating(false);
        return;
      }
      await createUser(newUserForm);
      await fetchUsers(); // refrescar lista
      closeAddModal();
    } catch (err) {
      console.error('Error creando usuario:', err);
      alert(err.response?.data?.message || 'Error al crear usuario');
    } finally {
      setCreating(false);
    }
  };

  const toggleVerification = async (userId, currentValue) => {
    setActionLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      await updateUser(userId, { isVerified: !currentValue });
      await fetchUsers();
    } catch (err) {
      console.error('Error toggling verification', err);
      alert(err.response?.data?.message || 'Error al actualizar verificación');
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleResendVerification = async (userId) => {
    setActionLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      await resendVerificationEmail(userId);
      alert('Email de verificación reenviado correctamente');
    } catch (err) {
      console.error('Error reenviando verificación', err);
      alert(err.response?.data?.message || 'Error al reenviar email de verificación');
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const { users, total, page, totalPages } = usersData;

  return (
    <div className="p-6 space-y-6">
      {/* Título */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Administración de usuarios
          </h1>
          <p className="text-sm text-gray-500">
            Gestiona planes, estados y estadísticas del sistema.
          </p>
        </div>

        <div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md shadow hover:bg-emerald-700"
          >
            Agregar usuario
          </button>
        </div>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Usuarios totales"
          value={stats?.totalUsuarios ?? '—'}
        />
        <StatCard
          title="Usuarios Free"
          value={stats?.totalFree ?? '—'}
        />
        <StatCard
          title="Usuarios Pro"
          value={stats?.totalPro ?? '—'}
        />
        <StatCard
          title="Diagnósticos totales"
          value={stats?.totalDiagnosticos ?? '—'}
        />
      </div>

      {/* Filtros */}
      <div className="bg-white shadow rounded-lg p-4">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col md:flex-row gap-4 items-start md:items-end"
        >
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Búsqueda
            </label>
            <input
              type="text"
              placeholder="Nombre, email, empresa..."
              value={filters.search}
              onChange={(e) =>
                handleChangeFilter('search', e.target.value)
              }
              className="w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan
            </label>
            <select
              value={filters.plan}
              onChange={(e) => handleChangeFilter('plan', e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            >
              <option value="all">Todos</option>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Verificación</label>
            <select
              value={filterVerified}
              onChange={(e) => setFilterVerified(e.target.value)}
              className="px-3 py-2 border rounded w-full max-w-xs"
            >
              <option value="todos">Todos</option>
              <option value="verificados">Verificados</option>
              <option value="no_verificados">No verificados</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filters.estado}
              onChange={(e) =>
                handleChangeFilter('estado', e.target.value)
              }
              className="rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            >
              <option value="all">Todos</option>
              <option value="activa">Activa</option>
              <option value="suspendida">Suspendida</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Verificado
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Diagnost. / mes
                </th>
                <th className="px-4 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                    No se encontraron usuarios con los filtros actuales.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <div className="font-medium text-gray-900">
                        {user.nombre}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="text-gray-900">
                        {user.empresa || '—'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.rut || ''}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user.tipoSuscripcion === 'pro'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                          }`}
                      >
                        {user.tipoSuscripcion === 'pro' ? 'Pro' : 'Free'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user.estadoSuscripcion === 'activa'
                          ? 'bg-emerald-100 text-emerald-800'
                          : user.estadoSuscripcion === 'suspendida'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {user.estadoSuscripcion}
                      </span>
                    </td>

                    {/* Columna Verificado + acciones relacionadas */}
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        {user.isVerified ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            Verificado
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                            No verificado
                          </span>
                        )}

                        <button
                          onClick={() => toggleVerification(user._id, !!user.isVerified)}
                          disabled={!!actionLoading[user._id]}
                          className="text-xs text-gray-600 hover:text-gray-800 ml-1"
                        >
                          {actionLoading[user._id] ? '...' : (user.isVerified ? 'Desverificar' : 'Verificar')}
                        </button>
                      </div>
                      {!user.isVerified && (
                        <div className="mt-1">
                          <button
                            onClick={() => handleResendVerification(user._id)}
                            disabled={!!actionLoading[user._id]}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            {actionLoading[user._id] ? 'Enviando...' : 'Reenviar email'}
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-2">
                      <div className="text-gray-900">
                        {user.limites?.diagnosticosRealizados ?? user.diagnosticosRealizados ?? 0} /{' '}
                        {(user.limites?.diagnosticosMes == null || user.limites?.diagnosticosMes <= 0)
                          ? '∞'
                          : user.limites.diagnosticosMes}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.limites?.ultimoResetDiagnosticos
                          ? new Date(user.limites.ultimoResetDiagnosticos).toLocaleDateString('es-CL')
                          : ''}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(user)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-red-200 text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100">
          <div className="text-sm text-gray-600">
            Mostrando{' '}
            <span className="font-medium">
              {users.length === 0 ? 0 : (page - 1) * filters.limit + 1}
            </span>{' '}
            a{' '}
            <span className="font-medium">
              {(page - 1) * filters.limit + users.length}
            </span>{' '}
            de <span className="font-medium">{total}</span> usuarios
          </div>
          <div className="flex items-center space-x-2">
            <button
              disabled={page <= 1}
              onClick={() =>
                handleChangeFilter('page', Math.max(1, page - 1))
              }
              className="px-3 py-1 text-xs rounded border border-gray-300 text-gray-700 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-xs text-gray-600">
              Página {page} de {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() =>
                handleChangeFilter('page', Math.min(totalPages, page + 1))
              }
              className="px-3 py-1 text-xs rounded border border-gray-300 text-gray-700 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Error global */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {/* Modal editar usuario */}
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          form={editForm}
          onChange={handleEditChange}
          onClose={closeEditModal}
          onSave={handleSaveUser}
          saving={saving}
        />
      )}

      {/* Modal crear usuario */}
      {showAddModal && (
        <AddUserModal
          form={newUserForm}
          onChange={handleNewUserChange}
          onClose={closeAddModal}
          onCreate={handleCreateUser}
          creating={creating}
        />
      )}

      {/* Confirm eliminar */}
      {userToDelete && (
        <DeleteConfirmModal
          user={userToDelete}
          onClose={closeDeleteConfirm}
          onConfirm={handleDeleteUser}
          deleting={deleting}
        />
      )}
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white shadow rounded-lg px-4 py-3">
    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
      {title}
    </div>
    <div className="mt-1 text-2xl font-semibold text-gray-900">
      {typeof value === 'number'
        ? value.toLocaleString('es-CL')
        : value}
    </div>
  </div>
);

const EditUserModal = ({ user, form, onChange, onClose, onSave, saving }) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Editar usuario
        </h2>
        <div className="text-sm text-gray-600">
          <div className="font-medium text-gray-900">{user.nombre}</div>
          <div>{user.email}</div>
          <div className="text-xs text-gray-500 mt-1">
            {user.empresa} {user.rut && `• ${user.rut}`}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan
            </label>
            <select
              value={form.tipoSuscripcion}
              onChange={(e) =>
                onChange('tipoSuscripcion', e.target.value)
              }
              className="w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            >
              <option value="free">Free</option>
              <option value="pro">Pro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado de suscripción
            </label>
            <select
              value={form.estadoSuscripcion}
              onChange={(e) =>
                onChange('estadoSuscripcion', e.target.value)
              }
              className="w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            >
              <option value="activa">Activa</option>
              <option value="suspendida">Suspendida</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              value={form.role}
              onChange={(e) => onChange('role', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            >
              <option value="user">Usuario</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={onSave}
            className="px-3 py-1.5 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AddUserModal = ({ form, onChange, onClose, onCreate, creating }) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Crear nuevo usuario</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input type="text" value={form.nombre} onChange={(e) => onChange('nombre', e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm p-2 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => onChange('email', e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm p-2 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input type="password" value={form.password} onChange={(e) => onChange('password', e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm p-2 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Empresa (opcional)</label>
            <input type="text" value={form.empresa} onChange={(e) => onChange('empresa', e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm p-2 text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
              <select value={form.tipoSuscripcion} onChange={(e) => onChange('tipoSuscripcion', e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm p-2 text-sm">
                <option value="free">Free</option>
                <option value="pro">Pro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select value={form.estadoSuscripcion} onChange={(e) => onChange('estadoSuscripcion', e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm p-2 text-sm">
                <option value="activa">Activa</option>
                <option value="suspendida">Suspendida</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select value={form.role} onChange={(e) => onChange('role', e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm p-2 text-sm">
              <option value="user">Usuario</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button type="button" onClick={onClose} className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50">Cancelar</button>
          <button type="button" disabled={creating} onClick={onCreate} className="px-3 py-1.5 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60">
            {creating ? 'Creando...' : 'Crear usuario'}
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ user, onClose, onConfirm, deleting }) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Eliminar usuario
        </h2>
        <p className="text-sm text-gray-600">
          ¿Estás seguro de que quieres eliminar al usuario{' '}
          <span className="font-medium">{user.nombre}</span> (
          {user.email})? Esta acción eliminará también sus diagnósticos y
          no se puede deshacer.
        </p>
        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={onConfirm}
            className="px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsuariosAdmin;