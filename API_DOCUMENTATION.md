# Documentación de la API - Ecclesia Flow

Esta guía detalla los endpoints y las estructuras JSON que el frontend espera del backend en Java (Spring Boot).

## Configuración Base
La URL base por defecto es `http://localhost:8080/api`. Puedes cambiarla en el archivo `.env`.

---

## 1. Usuarios (`/users`)

### GET `/api/users`
Retorna la lista de todos los servidores.

**Respuesta Ejemplo:**
```json
[
  {
    "id": "u1",
    "name": "Juan Pérez",
    "role": "Líder de Alabanza",
    "ministry": "Alabanza",
    "email": "juan.perez@iglesia.com",
    "phone": "+57 300 123 4567",
    "avatar": "https://picsum.photos/seed/juan/200/200",
    "active": true
  }
]
```

---

## 2. Ministerios (`/ministries`)

### GET `/api/ministries`
Lista los ministerios y sus posiciones disponibles.

**Respuesta Ejemplo:**
```json
[
  {
    "id": "m1",
    "name": "Alabanza",
    "positions": ["Guitarra", "Bajo", "Batería", "Piano", "Voz"]
  }
]
```

### POST `/api/ministries`
Crea un nuevo ministerio.

**Cuerpo (Request):**
```json
{
  "name": "Audiovisuales",
  "positions": ["Cámara", "Sonido"]
}
```

---

## 3. Programación / Eventos (`/events`)

### GET `/api/events`
Obtiene la programación de actividades.

**Respuesta Ejemplo:**
```json
[
  {
    "id": "e1",
    "date": "2024-05-19",
    "time": "09:00 AM",
    "ministries": {
      "Alabanza": [
        { "position": "Voz Principal", "personName": "Juan Pérez" },
        { "position": "Bajo", "personName": "Maria Lopez" }
      ]
    }
  }
]
```

### POST `/api/events`
Publica una nueva programación.

**Cuerpo (Request):**
```json
{
  "date": "2024-06-01",
  "time": "10:00 AM",
  "ministries": {
    "Alabanza": [
      { "position": "Guitarra", "personName": "Andrés Soto" }
    ]
  }
}
```

---

## 4. Tiempo con Dios - TCD (`/tcd`)

### GET `/api/tcd`
Lista las publicaciones de TCD.

**Respuesta Ejemplo:**
```json
[
  {
    "id": "t1",
    "userId": "u1",
    "userName": "Juan Pérez",
    "date": "2024-05-18",
    "image": "https://picsum.photos/seed/bible1/400/300"
  }
]
```

### POST `/api/tcd`
Sube una nueva entrada de TCD.

**Cuerpo (Request):**
```json
{
  "userId": "u1",
  "userName": "Juan Pérez",
  "date": "2024-05-20",
  "image": "data:image/png;base64,..."
}
```

---

## 5. Asignaciones / Habilidades (`/assignments`)

### GET `/api/assignments`
Lista las habilidades o especialidades de los servidores.

**Respuesta Ejemplo:**
```json
[
  {
    "id": "a1",
    "userId": "u1",
    "userName": "Juan Pérez",
    "ministryId": "m1",
    "ministryName": "Alabanza",
    "position": "Guitarra"
  }
]
```

### POST `/api/assignments`
Registra una nueva habilidad para un servidor.

**Cuerpo (Request):**
```json
{
  "userId": "u2",
  "userName": "Andrés Soto",
  "ministryId": "m1",
  "ministryName": "Alabanza",
  "position": "Batería"
}
```
