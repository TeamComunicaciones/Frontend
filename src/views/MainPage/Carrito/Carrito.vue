<template>
  <div class="carrito-root">
    <!-- Overlay -->
    <transition name="fade">
      <div
        v-if="mostrarCarrito"
        class="overlay"
        @click.self="toggleCarrito"
        aria-hidden="true"
      ></div>
    </transition>

    <!-- Botón flotante -->
    <button class="fab" type="button" @click="toggleCarrito" aria-label="Abrir carrito">
      <span class="fab-icon">
        <IBiCart />
      </span>

      <!-- Badge total items -->
      <span v-if="totalItems > 0" class="fab-badge">
        {{ totalItems }}
      </span>
    </button>

    <!-- Drawer -->
    <transition name="slide">
      <aside
        v-if="mostrarCarrito"
        class="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
      >
        <!-- Header -->
        <div class="drawer-header">
          <div>
            <p class="drawer-kicker">Tu compra</p>
            <h3 class="drawer-title">Carrito</h3>
          </div>

          <button class="icon-btn" type="button" @click="toggleCarrito" aria-label="Cerrar carrito">
            ✕
          </button>
        </div>

        <!-- Body -->
        <div class="drawer-body">
          <!-- Vacío -->
          <div v-if="carrito.length === 0" class="empty">
            <div class="empty-icon">🛒</div>
            <p class="empty-title">Tu carrito está vacío</p>
            <p class="empty-text">Agrega productos para verlos aquí.</p>
            <button class="btn btn-danger w-100" type="button" @click="toggleCarrito">
              Seguir comprando
            </button>
          </div>

          <!-- Lista -->
          <div v-else class="items">
            <section v-for="producto in carrito" :key="producto.id" class="item">
              <div class="item-left">
                <div class="thumb">
                  <span class="qty-badge">x {{ producto.cantidad }}</span>
                  <img
                    class="thumb-img"
                    :src="getImageUrl(producto.img)"
                    :alt="producto.name"
                    loading="lazy"
                  />
                </div>
              </div>

              <div class="item-right">
                <div class="item-top">
                  <h5 class="item-title" :title="producto.name">{{ producto.name }}</h5>

                  <button
                    class="trash-btn"
                    type="button"
                    @click="eliminarProducto(producto)"
                    aria-label="Eliminar producto"
                    title="Eliminar"
                  >
                    <IBiTrash />
                  </button>
                </div>

                <div class="item-meta">
                  <p class="unit">
                    {{ formatoMoneda(producto.value) }}
                    <span class="muted">/ und</span>
                  </p>
                  <p class="line-total">
                    Total: <strong>{{ formatoMoneda(producto.total) }}</strong>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <!-- Footer fijo -->
        <div class="drawer-footer" v-if="carrito.length > 0">
          <div class="total-row">
            <span class="total-label">A pagar</span>
            <span class="total-value">{{ formatoMoneda(totalCarrito) }}</span>
          </div>

          <div class="footer-actions">
            <button class="btn btn-outline-secondary w-100" type="button" @click="vaciarCarrito">
              Vaciar
            </button>

            <button class="btn btn-danger w-100" type="button" @click="enviarCompra">
              Enviar por WhatsApp
            </button>
          </div>

          <p class="footer-hint">
            Enviaremos el detalle de tu carrito al WhatsApp de TEAM.
          </p>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Carrito',
  data() {
    return {
      totalCarrito: 0,
      mostrarCarrito: false,
      carrito: [],
      nombre: null,
      correo: null,
    }
  },

  computed: {
    totalItems() {
      return this.carrito.reduce((acc, it) => acc + Number(it.cantidad || 0), 0)
    },
  },

  mounted() {
    const carritoGuardado = localStorage.getItem('carrito')
    if (carritoGuardado) {
      try {
        this.carrito = JSON.parse(carritoGuardado) || []
      } catch (e) {
        this.carrito = []
      }
    }

    const totalCarritoGuardado = localStorage.getItem('totalCarrito')
    if (totalCarritoGuardado) {
      const n = Number(totalCarritoGuardado)
      this.totalCarrito = Number.isFinite(n) ? n : 0
    }

    window.addEventListener('keydown', this.onKeydown)
  },

  beforeUnmount() {
    window.removeEventListener('keydown', this.onKeydown)
  },

  methods: {
    onKeydown(e) {
      if (e.key === 'Escape' && this.mostrarCarrito) this.toggleCarrito()
    },

    getImageUrl(name) {
      if (!name) return 'https://placehold.co/200x200?text=Producto'
      try {
        return new URL(`../../../assets/${name}`, import.meta.url).href
      } catch (e) {
        return 'https://placehold.co/200x200?text=Producto'
      }
    },

    formatoMoneda(valor) {
      const n = Number(valor)
      if (!Number.isFinite(n)) return '$ 0'
      return n.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    },

    toggleCarrito() {
      this.mostrarCarrito = !this.mostrarCarrito
    },

    persistir() {
      localStorage.setItem('carrito', JSON.stringify(this.carrito))
      localStorage.setItem('totalCarrito', String(this.totalCarrito))
    },

    vaciarCarrito() {
      this.carrito = []
      this.totalCarrito = 0
      this.persistir()
      this.$swal?.({
        title: 'Carrito vacío',
        icon: 'success',
        timer: 1200,
        showConfirmButton: false,
      })
    },

    agregarAlCarritoCarrito(producto) {
      const index = this.carrito.findIndex((item) => item.id === producto.id)

      if (index !== -1) {
        this.carrito[index].cantidad++
        this.carrito[index].total = Number(this.carrito[index].value) * Number(this.carrito[index].cantidad)
      } else {
        this.carrito.push({
          ...producto,
          cantidad: 1,
          total: Number(producto.value),
        })
      }

      this.totalCarrito = Number(this.totalCarrito) + Number(producto.value || 0)
      this.persistir()

      // Modal sweetalert como ya lo usas
      this.$swal?.({
        title: 'Agregado al carrito',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Ver carrito',
        cancelButtonText: 'Seguir comprando',
      }).then((result) => {
        if (result.isConfirmed) {
          if (!this.mostrarCarrito) this.toggleCarrito()
        }
      })
    },

    eliminarProducto(producto) {
      const index = this.carrito.findIndex((p) => p.id === producto.id)
      if (index === -1) return

      // resta 1 unidad del total siempre
      this.totalCarrito = Number(this.totalCarrito) - Number(this.carrito[index].value || 0)

      if (this.carrito[index].cantidad > 1) {
        this.carrito[index].cantidad--
        this.carrito[index].total = Number(this.carrito[index].value) * Number(this.carrito[index].cantidad)
      } else {
        this.carrito.splice(index, 1)
      }

      // protección para no quedar negativo por floats
      if (this.totalCarrito < 0) this.totalCarrito = 0

      this.persistir()
    },

    enviarCompra() {
      const numeroEmpresa = '3113698212'

      const items = this.carrito
        .map((item) => {
          return `Nombre: ${item.name}\nCantidad: ${item.cantidad}\nTotal: ${item.total}\n\n`
        })
        .join('')

      const mensajeFinal = `¡Hola! Me gustaría realizar esta compra:\n\n${items}Total: ${this.totalCarrito}`
      const mensaje = encodeURIComponent(mensajeFinal)
      const enlaceWhatsApp = `https://wa.me/${numeroEmpresa}?text=${mensaje}`

      // limpias como ya haces
      this.carrito = []
      this.totalCarrito = 0
      this.persistir()

      window.open(enlaceWhatsApp, '_blank')
    },
  },
}
</script>

<style scoped>
/* Root */
.carrito-root{
  position: relative;
  z-index: 1200;
  --brand: #E11419;
  --text: #0f172a;
  --muted: #64748b;
  --border: rgba(2,6,23,0.12);
  --shadow: 0 22px 55px rgba(2,6,23,0.22);
  --shadow-soft: 0 14px 32px rgba(2,6,23,0.14);
  --radius: 18px;
}

/* Overlay */
.overlay{
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.42);
  backdrop-filter: blur(2px);
  z-index: 1200;
}

/* FAB */
.fab{
  position: fixed;
  right: 18px;
  bottom: 18px;
  width: 56px;
  height: 56px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.25);
  background: var(--brand);
  color: #fff;
  display: grid;
  place-items: center;
  box-shadow: var(--shadow-soft);
  cursor: pointer;
  z-index: 1300;
  transition: transform .18s ease, box-shadow .18s ease;
}
.fab:hover{
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}
.fab-icon{
  display:grid;
  place-items:center;
  font-size: 20px;
}

/* Badge */
.fab-badge{
  position: absolute;
  top: -8px;
  right: -6px;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 999px;
  background: #fff;
  color: var(--brand);
  font-weight: 900;
  font-size: 12px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(2,6,23,0.12);
}

/* Drawer */
.drawer{
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: min(420px, 92vw);
  background: #fff;
  border-left: 1px solid var(--border);
  box-shadow: var(--shadow);
  z-index: 1301;
  display: flex;
  flex-direction: column;
}

/* Header */
.drawer-header{
  padding: 16px 16px 14px 16px;
  border-bottom: 1px solid rgba(2,6,23,0.08);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  background:
    radial-gradient(600px 200px at 20% 0%, rgba(225,20,25,0.16), transparent 55%),
    #fff;
}
.drawer-kicker{
  margin: 0;
  color: var(--muted);
  font-weight: 900;
  font-size: 12px;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.drawer-title{
  margin: 2px 0 0 0;
  font-weight: 950;
  letter-spacing: -0.02em;
  color: var(--text);
}

/* Close button */
.icon-btn{
  border: 1px solid rgba(2,6,23,0.10);
  background: rgba(255,255,255,0.85);
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  cursor: pointer;
  font-weight: 900;
}

/* Body */
.drawer-body{
  padding: 14px 14px 0 14px;
  flex: 1;
  overflow: hidden;
}

.items{
  overflow-y: auto;
  max-height: calc(100vh - 240px);
  padding-right: 4px;
}

/* Item */
.item{
  border: 1px solid rgba(2,6,23,0.10);
  border-radius: 18px;
  box-shadow: 0 10px 22px rgba(2,6,23,0.06);
  padding: 10px;
  display: grid;
  grid-template-columns: 86px 1fr;
  gap: 10px;
  margin-bottom: 12px;
  background: #fff;
}
.item-left{
  display:flex;
  align-items:flex-start;
  justify-content:center;
}
.thumb{
  position: relative;
  width: 76px;
  height: 76px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(2,6,23,0.10);
  background: #f8fafc;
}
.thumb-img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  display:block;
}
.qty-badge{
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(255,255,255,0.92);
  border: 1px solid rgba(2,6,23,0.12);
  color: var(--text);
  font-weight: 900;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
}

.item-right{
  display:flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.item-top{
  display:flex;
  justify-content: space-between;
  gap: 10px;
}
.item-title{
  margin: 0;
  font-weight: 950;
  color: var(--text);
  line-height: 1.2;
  font-size: 14px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.trash-btn{
  border: 1px solid rgba(2,6,23,0.10);
  background: rgba(255,255,255,0.9);
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display:grid;
  place-items:center;
  cursor: pointer;
  color: #b4232c;
}
.trash-btn:hover{
  background: rgba(225,20,25,0.06);
  border-color: rgba(225,20,25,0.22);
}

.item-meta{
  display:flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 8px;
}
.unit{
  margin: 0;
  color: #E11419;
  font-weight: 950;
  font-size: 13px;
}
.muted{
  color: var(--muted);
  font-weight: 800;
}
.line-total{
  margin: 0;
  color: var(--muted);
  font-weight: 850;
  font-size: 12px;
}

/* Footer */
.drawer-footer{
  padding: 14px;
  border-top: 1px solid rgba(2,6,23,0.08);
  background: #fff;
}
.total-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid rgba(2,6,23,0.10);
  border-radius: 16px;
  background: rgba(2,6,23,0.02);
  margin-bottom: 10px;
}
.total-label{
  color: var(--muted);
  font-weight: 900;
  letter-spacing: .02em;
}
.total-value{
  color: var(--text);
  font-weight: 950;
  font-size: 16px;
}
.footer-actions{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.footer-hint{
  margin: 10px 0 0 0;
  font-size: 12px;
  color: var(--muted);
  font-weight: 700;
}

/* Empty state */
.empty{
  padding: 14px 6px;
  text-align: center;
}
.empty-icon{
  font-size: 38px;
  margin-bottom: 6px;
}
.empty-title{
  margin: 0;
  font-weight: 950;
  color: var(--text);
}
.empty-text{
  margin: 6px 0 14px 0;
  color: var(--muted);
  font-weight: 700;
  font-size: 13px;
}

/* Animations */
.fade-enter-active, .fade-leave-active{
  transition: opacity .18s ease;
}
.fade-enter-from, .fade-leave-to{
  opacity: 0;
}
.slide-enter-active, .slide-leave-active{
  transition: transform .22s ease, opacity .22s ease;
}
.slide-enter-from, .slide-leave-to{
  transform: translateX(14px);
  opacity: 0;
}
</style>
