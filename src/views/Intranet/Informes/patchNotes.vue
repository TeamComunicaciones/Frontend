<template>
  <div class="container py-5">
    <h1 class="display-6 fw-bold mb-4" style="font-family: 'Comfortaa', cursive;">Notas de Versión</h1>

    <div class="bg-white p-4 shadow-sm rounded mb-5" style="font-family: 'Open Sans', sans-serif;">
      <h2 class="h5 fw-bold text-danger mb-3">Versión 1.6 - 9 de mayo de 2025</h2>
      <ul class="ps-3">
        <li class="mb-2">
          Se llevó a cabo una reestructuración completa de la interfaz del módulo de corresponsal, tanto para los roles de informe como de cajero. Esta tarea incluyó una optimización visual de las tablas, aplicando criterios de usabilidad para mejorar la lectura mediante el uso adecuado de colores, tipografías y jerarquías visuales.
        </li>
        <li class="mb-2">
          Se estandarizó el uso de fuentes tipográficas en toda la aplicación, garantizando coherencia visual y profesionalismo en todos los módulos y dispositivos.
        </li>
        <li class="mb-2">
          Se rediseñó la vista general de la interfaz para dispositivos móviles, mejorando la experiencia de usuario en pantallas pequeñas y asegurando una navegación más fluida y responsiva.
        </li>
        <li class="mb-2">
          A nivel de código, se realizó una homologación en el uso de SCSS, aplicando esta metodología de forma uniforme en todos los módulos para facilitar el mantenimiento, la escalabilidad del diseño y la coherencia visual del sistema.
        </li>
        <li class="mb-2">
          Se consolidó el manejo de autenticación mediante JWT centralizando la lógica correspondiente en un único archivo de servicios (<code>service.js</code>), lo que mejora la seguridad, la organización del código y facilita futuras modificaciones o integraciones.
        </li>
      </ul>
    </div>

    <!-- Aquí puedes añadir futuras versiones -->
    <!--
    <div class="bg-white p-4 shadow-sm rounded mb-5">
      <h2 class="h5 fw-bold text-danger mb-3">Versión 1.X - [Fecha]</h2>
      <ul class="ps-3">
        <li class="mb-2">[Cambio realizado]</li>
        ...
      </ul>
    </div>
    -->
  </div>
</template>
