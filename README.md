# 🏗️ Fastify + Next.js + TypeScript Project

## 🛠️ **Technologies Used**
✅ **Fastify** - Lightweight, high-performance backend  
✅ **Next.js** - Server-side rendering (SSR), static generation (SSG)  
✅ **TypeScript** - Type safety for both backend & frontend 
✅ **Zustand** - Lightweight global state management 
✅ **PostgreSQL** - Relational database integration  
✅ **pg-promise** - Query builder  
✅ **Jest & Supertest** - Unit & integration testing  
✅ **ESLint** - Code quality & formatting 

## ⚡ **Installation & Setup**
### **Clone the Repository**

```bash
git clone https://github.com/hemimorphite/ecommerce.git
cd ecommerce
```
### **Backend Setup**
#### **Navigate to the Backend Directory**
```bash
cd backend
``` 

#### **Install Dependencies**

```bash
npm install
```

#### **Set Up Environment Variables**

Edit the `.env` file with your database and server configurations.

```bash
DB_HOST=localhost
DB_PORT=5433
DB_NAME=ecommerce
DB_USER=admin
DB_PASSWORD=admin
PORT=3000                                                                                                                                       ```

Edit the `.postgratorrc.json` file with your database configurations.

```bash
{
  "driver": "pg",
  "host": "localhost",
  "port": 5433,
  "database": "ecommerce",
  "username": "admin",
  "password": "admin",
  "schemaTable": "migrations"
}
```

#### **Running Migrations**

Apply migrations

```bash
npx postgrator
```

Rollback Last Migration

```bash
npx postgrator 0
```

#### **Testing**

```bash
npm run test
```

#### **Building and Running the Backend**

```bash
npm run build
npm run start
```


### **Frontend Setup**
#### **Navigate to the Frontend Directory**
```bash
cd frontend
``` 

#### **Install Dependencies**

```bash
npm install
```

#### **Set Up Environment Variables**

Edit the `.env` file with your database and server configurations.

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

#### **Building and Running the Frontend**

```bash
npm run build
PORT=4000 npm run start
```