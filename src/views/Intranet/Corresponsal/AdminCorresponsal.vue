<template>
  <div class="bg-light">
    <div class="vld-parent">
      <loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
    </div>

    <div class="container my-5">
      <div class="card border-0 shadow-sm admin-card">
        <div
          class="card-header bg-dark text-white d-flex justify-content-between align-items-center"
        >
          <div>
            <h1 class="h3 mb-1" style="color: white;">Gestión de Cajeros Corresponsal</h1>
            <p class="mb-0 text-white-50">
              Administra qué usuarios tienen rol de <strong>Cajero</strong> y su sucursal asignada.
            </p>
          </div>
          <span class="badge bg-danger">Solo Administradores</span>
        </div>

        <div class="card-body p-4 p-md-5">
          <!-- Resumen / filtros -->
          <div class="row g-3 align-items-end mb-4">
            <div class="col-md-3">
              <div class="kpi-box bg-light border rounded p-3 text-center h-100">
                <div class="kpi-label">Cajeros</div>
                <div class="kpi-value">{{ usuariosFiltrados.length }}</div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="kpi-box bg-light border rounded p-3 text-center h-100">
                <div class="kpi-label">Con sucursal</div>
                <div class="kpi-value text-success">
                  {{ usuariosFiltrados.filter(u => !!u.sucursal).length }}
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="kpi-box bg-light border rounded p-3 text-center h-100">
                <div class="kpi-label">Sin sucursal</div>
                <div class="kpi-value text-warning">
                  {{ usuariosFiltrados.filter(u => !u.sucursal).length }}
                </div>
              </div>
            </div>

            <div class="col-md-3">
              <label class="form-label fw-bold">Buscar usuario / nombre</label>
              <input
                type="text"
                class="form-control"
                v-model="filtroTexto"
                placeholder="Username, nombre o apellido..."
              />
            </div>
          </div>

          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <label class="form-label fw-bold">Filtrar por sucursal</label>
              <BFormSelect
                v-model="filtroSucursal"
                :options="[
                  { value: '', text: 'Todas' },
                  ...sucursalOptions
                ]"
              />
            </div>
          </div>

          <!-- Tabla -->
          <div v-if="isLoading" class="text-center p-5">
            <div
              class="spinner-border text-danger"
              role="status"
              style="width: 3rem; height: 3rem;"
            ></div>
            <p class="mt-3 mb-0">Cargando cajeros y sucursales...</p>
          </div>

          <div v-else class="card shadow-sm border-0">
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="bg-light">
                  <tr>
                    <th scope="col">Usuario</th>
                    <th scope="col">Nombre</th>
                    <th scope="col" style="width: 25%;">Sucursal asignada</th>
                    <th scope="col" class="text-center">Activo</th>
                    <th scope="col" class="text-center">Rol Cajero</th>
                    <th scope="col" class="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in usuariosFiltrados" :key="user.username">
                    <!-- Usuario -->
                    <td>
                      <strong>{{ user.username }}</strong>
                    </td>

                    <!-- Nombre -->
                    <td>
                      <span v-if="user.full_name">
                        {{ user.full_name }}
                      </span>
                      <span v-else class="text-muted fst-italic">Sin nombre</span>
                    </td>

                    <!-- Sucursal asignada -->
                    <td>
                      <BFormSelect
                        class="form-select form-select-sm"
                        :options="[
                          { value: null, text: 'Sin sucursal' },
                          ...sucursalOptions
                        ]"
                        v-model="user.sucursal"
                        @change="onChangeSucursal(user)"
                      />
                    </td>

                    <!-- Activo -->
                    <td class="text-center">
                      <div class="form-check form-switch d-flex justify-content-center">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                          :checked="user.is_active"
                          @change="toggleActivo(user)"
                        />
                      </div>
                    </td>

                    <!-- Rol Cajero -->
                    <td class="text-center">
                      <div class="form-check d-flex justify-content-center">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          v-model="user.tiene_caja"
                          @change="toggleRolCajero(user)"
                        />
                      </div>
                    </td>

                    <!-- Acciones -->
                    <td class="text-end">
                      <button
                        class="btn btn-sm btn-outline-secondary me-2"
                        @click="editarUsuario(user)"
                        title="Editar usuario"
                      >
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button
                        class="btn btn-sm btn-outline-danger"
                        @click="eliminarUsuario(user)"
                        title="Eliminar usuario"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>

                  <tr v-if="usuariosFiltrados.length === 0">
                    <td colspan="6" class="text-center text-muted p-4">
                      No se encontraron usuarios con los filtros actuales.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="card-footer text-muted small d-flex justify-content-between">
              <span>
                Mostrando {{ usuariosFiltrados.length }} cajeros filtrados.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import backendRouter from '@/components/BackendRouter/BackendRouter';
import axios from 'axios';
import { BFormSelect } from 'bootstrap-vue-next';
import Swal from 'sweetalert2';

export default {
  components: {
    Loading,
    BFormSelect,
  },
  data() {
    return {
      isLoading: false,
      fullPage: true,

      // crudo del backend
      sucursales: [],
      responsablesMap: {}, // { terminal: "username-first-last" }
      rawUsersStrings: [], // ["username-first-last", ...]

      // usuarios para la tabla
      usuarios: [],

      filtroTexto: '',
      filtroSucursal: '',
    };
  },
  computed: {
    sucursalOptions() {
      return this.sucursales.map((s) => ({ value: s, text: s }));
    },
    usuariosFiltrados() {
      const text = this.filtroTexto.trim().toLowerCase();
      const suc = this.filtroSucursal;

      return this.usuarios.filter((u) => {
        const matchesText =
          !text ||
          u.username.toLowerCase().includes(text) ||
          (u.full_name && u.full_name.toLowerCase().includes(text));

        const matchesSucursal = !suc || u.sucursal === suc;

        return matchesText && matchesSucursal;
      });
    },
  },
  methods: {
    /**
     * Carga datos desde /encargados-corresponsal
     * y arma usuarios a partir de:
     *  - users: ["username-first-last", ...]
     *  - responsables: { terminal: "username-first-last" }
     */
    async getData() {
      this.isLoading = true;
      try {
        const path = backendRouter.data + 'encargados-corresponsal';
        const { data } = await axios.post(path, {});

        this.sucursales = data.sucursales || [];
        this.responsablesMap = data.responsables || {};

        const usersDetailed = data.users_detailed || [];
        const rawUsersStrings = data.users || [];

        // Map sucursal principal por username
        const sucursalPorUsuario = {};
        Object.entries(this.responsablesMap).forEach(([terminal, userStr]) => {
          const [username] = String(userStr || '').split('-');
          if (username && !sucursalPorUsuario[username]) {
            sucursalPorUsuario[username] = terminal;
          }
        });

        if (usersDetailed.length) {
          // ✅ Backend nuevo
          this.usuarios = usersDetailed.map((u) => {
            const first_name = u.first_name || '';
            const last_name = u.last_name || '';
            const full_name = `${first_name} ${last_name}`.trim() || u.username;

            return {
              id: u.id,
              username: u.username,
              first_name,
              last_name,
              full_name,
              sucursal: sucursalPorUsuario[u.username] || null,
              is_active: !!u.is_active,
              tiene_caja: !!u.tiene_caja,
            };
          });
        } else {
          // 🔙 compatibilidad vieja (por si no has desplegado el backend nuevo aún)
          this.usuarios = rawUsersStrings.map((uStr) => {
            const [username, first_name = '', last_name = ''] = uStr.split('-');
            return {
              username,
              first_name,
              last_name,
              full_name: `${first_name} ${last_name}`.trim(),
              sucursal: sucursalPorUsuario[username] || null,
              is_active: true,
              tiene_caja: true,
            };
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudieron cargar los datos iniciales.', 'error');
      } finally {
        this.isLoading = false;
      }
    },


    /**
     * Cambiar sucursal asignada a un usuario.
     * Para mantener compatibilidad con tu backend actual,
     * usamos el endpoint `assign-responsible` así:
     * 
     *   sucursal: nueva sucursal (terminal)
     *   encargado: "username-first-last"
     * 
     * OJO: esto crea/actualiza el responsable de ESA sucursal,
     * no borra otras que el usuario pueda tener. Si quieres
     * que un usuario solo pueda tener UNA sucursal, habría que
     * agregar lógica en backend para limpiar las anteriores.
     */
    async onChangeSucursal(user) {
      const sucursal = user.sucursal;

      if (!sucursal) {
        // TODO (opcional): aquí podrías implementar un endpoint
        // para quitar al usuario como responsable de TODAS sus sucursales.
        Swal.fire(
          'Pendiente',
          'Seleccionaste "Sin sucursal". Para desasignar completamente un usuario de todas las sucursales, es mejor manejarlo desde backend (ej. endpoint para limpiar Responsables_corresponsal).',
          'info'
        );
        return;
      }

      const encargadoStr = `${user.username}-${user.first_name}-${user.last_name}`;
      const path = backendRouter.data + 'assign-responsible';
      const data = {
        sucursal,
        encargado: encargadoStr,
      };

      try {
        await axios.post(path, data);
        Swal.fire({
          icon: 'success',
          title: 'Asignado',
          text: `Se asignó la sucursal ${sucursal} a ${user.username}.`,
          timer: 1300,
          showConfirmButton: false,
        });
        // Refrescamos responsables
        await this.getData();
      } catch (error) {
        console.error(error);
        Swal.fire(
          'Error',
          'No se pudo asignar la sucursal. Se restaurará el valor anterior.',
          'error'
        );
        await this.getData();
      }
    },

    /**
     * Toggle activo/inactivo.
     * Aquí SOLO dejo listo el hook.
     * 
     * Backend sugerido:
     *   POST /admin/usuarios/activar/
     *   payload: { username: '...', is_active: true/false }
     */
    async toggleActivo(user) {
      const nuevoEstado = !user.is_active;

      // TODO: cambia este path por el que implementes en backend
      const path = backendRouter.data + 'admin/usuarios/activar/';

      try {
        await axios.post(path, {
          username: user.username,
          is_active: nuevoEstado,
        });
        user.is_active = nuevoEstado;
        Swal.fire({
          icon: 'success',
          title: nuevoEstado ? 'Usuario activado' : 'Usuario desactivado',
          timer: 1300,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo cambiar el estado del usuario.', 'error');
      }
    },

    /**
     * Toggle rol cajero (permiso id=11).
     * 
     * Sugerencia backend:
     *   - Endpoint que reciba username y un boolean "tiene_caja"
     *   - Internamente, crea/actualiza Permisos_usuarios con permiso.id = 11
     */
    async toggleRolCajero(user) {
      const nuevoValor = user.tiene_caja;

      // TODO: cambia este path por el que implementes en backend
      const path = backendRouter.data + 'admin/cajeros/rol-caja/';

      try {
        await axios.post(path, {
          username: user.username,
          tiene_caja: nuevoValor,
        });
        Swal.fire({
          icon: 'success',
          title: 'Rol actualizado',
          text: nuevoValor
            ? 'Se otorgó el rol Cajero al usuario.'
            : 'Se desactivó el rol Cajero para el usuario.',
          timer: 1300,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo actualizar el rol de cajero.', 'error');
      }
    },

    /**
     * Editar usuario (username, nombre, email, etc.)
     * 
     * Te dejo un modal SweetAlert parecido al de Gestión de Asesores.
     * Backend sugerido:
     *   PUT /admin/usuarios/<username>/
     */
    editarUsuario(user) {
      Swal.fire({
        title: 'Editar Usuario',
        html: `
          <input id="swal-username" class="swal2-input" placeholder="Username" value="${user.username}">
          <input id="swal-firstname" class="swal2-input" placeholder="Nombre" value="${user.first_name}">
          <input id="swal-lastname" class="swal2-input" placeholder="Apellido" value="${user.last_name}">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          const username = document.getElementById('swal-username').value;
          const first_name = document.getElementById('swal-firstname').value;
          const last_name = document.getElementById('swal-lastname').value;

          if (!username) {
            Swal.showValidationMessage('El username es obligatorio');
            return false;
          }

          return { username, first_name, last_name };
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          // TODO: cambia este path por el que implementes
          const path = backendRouter.data + `admin/usuarios/${user.username}/`;

          try {
            await axios.put(path, result.value);
            Swal.fire('Actualizado', 'El usuario ha sido actualizado.', 'success');
            this.getData();
          } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
          }
        }
      });
    },

    /**
     * Eliminar usuario.
     * 
     * Backend sugerido:
     *   DELETE /admin/usuarios/<username>/
     */
    eliminarUsuario(user) {
      Swal.fire({
        title: '¿Eliminar este usuario?',
        text: `Se eliminará el usuario ${user.username}. Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          // TODO: cambia este path por el que implementes
          const path = backendRouter.data + `admin/usuarios/${user.username}/`;

          try {
            await axios.delete(path);
            Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
            this.getData();
          } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
          }
        }
      });
    },
  },
  created() {
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.bg-light {
  background-color: #f8f9fa !important;
}

.admin-card {
  border-radius: 1rem;
  overflow: hidden;
}

h1,
h2,
h3,
h4,
h5,
h6,
.form-label,
.btn,
p,
.nav-link,
.card-title,
.card-text {
  font-family: 'Poppins', sans-serif;
  color: #343a40;
}

.kpi-box {
  .kpi-label {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #6c757d;
    margin-bottom: 0.25rem;
  }
  .kpi-value {
    font-size: 1.6rem;
    font-weight: 700;
    color: #df1115;
  }
}

</style>
