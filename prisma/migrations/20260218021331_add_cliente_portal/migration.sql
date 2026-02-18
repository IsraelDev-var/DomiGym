-- CreateTable
CREATE TABLE "rutinas" (
    "id" SERIAL NOT NULL,
    "miembro_id" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "dias_semana" INTEGER NOT NULL DEFAULT 3,
    "objetivo" VARCHAR(100) NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rutinas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ejercicios_rutina" (
    "id" SERIAL NOT NULL,
    "rutina_id" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "dia" VARCHAR(20) NOT NULL,
    "series" INTEGER NOT NULL,
    "repeticiones" INTEGER NOT NULL,
    "descanso" INTEGER NOT NULL,
    "notas" TEXT,

    CONSTRAINT "ejercicios_rutina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planes_dieta" (
    "id" SERIAL NOT NULL,
    "miembro_id" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "objetivo" VARCHAR(100) NOT NULL,
    "calorias_obj" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "planes_dieta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comidas_dieta" (
    "id" SERIAL NOT NULL,
    "plan_dieta_id" INTEGER NOT NULL,
    "tipo" VARCHAR(30) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "calorias" INTEGER,
    "proteinas" INTEGER,
    "carbos" INTEGER,
    "grasas" INTEGER,

    CONSTRAINT "comidas_dieta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recomendaciones_salud" (
    "id" SERIAL NOT NULL,
    "miembro_id" INTEGER NOT NULL,
    "titulo" VARCHAR(150) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categoria" VARCHAR(50) NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recomendaciones_salud_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rutinas" ADD CONSTRAINT "rutinas_miembro_id_fkey" FOREIGN KEY ("miembro_id") REFERENCES "miembros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ejercicios_rutina" ADD CONSTRAINT "ejercicios_rutina_rutina_id_fkey" FOREIGN KEY ("rutina_id") REFERENCES "rutinas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planes_dieta" ADD CONSTRAINT "planes_dieta_miembro_id_fkey" FOREIGN KEY ("miembro_id") REFERENCES "miembros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comidas_dieta" ADD CONSTRAINT "comidas_dieta_plan_dieta_id_fkey" FOREIGN KEY ("plan_dieta_id") REFERENCES "planes_dieta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recomendaciones_salud" ADD CONSTRAINT "recomendaciones_salud_miembro_id_fkey" FOREIGN KEY ("miembro_id") REFERENCES "miembros"("id") ON DELETE CASCADE ON UPDATE CASCADE;
