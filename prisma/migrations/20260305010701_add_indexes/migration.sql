-- CreateIndex
CREATE INDEX "accesos_miembro_id_idx" ON "accesos"("miembro_id");

-- CreateIndex
CREATE INDEX "accesos_sucursal_id_idx" ON "accesos"("sucursal_id");

-- CreateIndex
CREATE INDEX "accesos_fecha_hora_acceso_idx" ON "accesos"("fecha_hora_acceso");

-- CreateIndex
CREATE INDEX "facturas_miembro_id_idx" ON "facturas"("miembro_id");

-- CreateIndex
CREATE INDEX "inventario_sucursal_id_idx" ON "inventario"("sucursal_id");

-- CreateIndex
CREATE INDEX "inventario_categoria_idx" ON "inventario"("categoria");

-- CreateIndex
CREATE INDEX "miembros_sucursal_id_idx" ON "miembros"("sucursal_id");

-- CreateIndex
CREATE INDEX "miembros_plan_membresia_id_idx" ON "miembros"("plan_membresia_id");

-- CreateIndex
CREATE INDEX "miembros_estado_membresia_idx" ON "miembros"("estado_membresia");

-- CreateIndex
CREATE INDEX "pagos_miembro_id_idx" ON "pagos"("miembro_id");

-- CreateIndex
CREATE INDEX "pagos_estado_idx" ON "pagos"("estado");

-- CreateIndex
CREATE INDEX "pagos_fecha_pago_idx" ON "pagos"("fecha_pago");

-- CreateIndex
CREATE INDEX "ventas_sucursal_id_idx" ON "ventas"("sucursal_id");

-- CreateIndex
CREATE INDEX "ventas_miembro_id_idx" ON "ventas"("miembro_id");

-- CreateIndex
CREATE INDEX "ventas_fecha_venta_idx" ON "ventas"("fecha_venta");

-- CreateIndex
CREATE INDEX "ventas_estado_idx" ON "ventas"("estado");
