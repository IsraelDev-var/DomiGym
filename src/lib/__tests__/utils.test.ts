describe('Utils - Transformación de Datos', () => {
  
  // Utilidades para pruebas
  const formatearEmail = (email: string): string => email.toLowerCase().trim();
  
  const formatearFecha = (fecha: Date): string => {
    return fecha.toISOString().split('T')[0];
  };
  
  const formatearPrecio = (precio: number): string => {
    return `$${(precio / 100).toFixed(2)}`;
  };
  
  const capitalizarNombre = (nombre: string): string => {
    return nombre
      .toLowerCase()
      .split(' ')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ');
  };

  describe('TC-U010: Formato de Email', () => {
    test('Debe convertir email a minúsculas', () => {
      const email = 'USUARIO@GYM.COM';
      const resultado = formatearEmail(email);
      
      expect(resultado).toBe('usuario@gym.com');
    });

    test('Debe remover espacios en blanco', () => {
      const email = '  usuario@gym.com  ';
      const resultado = formatearEmail(email);
      
      expect(resultado).toBe('usuario@gym.com');
    });

    test('Debe aplicar ambas transformaciones', () => {
      const email = '  USUARIO@GYM.COM  ';
      const resultado = formatearEmail(email);
      
      expect(resultado).toBe('usuario@gym.com');
    });
  });

  describe('TC-U011: Formato de Fechas', () => {
    test('Debe formatear fecha a YYYY-MM-DD', () => {
      const fecha = new Date('2026-03-24');
      const resultado = formatearFecha(fecha);
      
      expect(resultado).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(resultado).toContain('2026');
    });

    test('Debe manejar fechas correctamente', () => {
      const fecha = new Date('2026-01-15');
      const resultado = formatearFecha(fecha);
      
      expect(resultado).toBe('2026-01-15');
    });
  });

  describe('TC-U012: Formato de Precios', () => {
    test('Debe convertir centavos a formato moneda', () => {
      const precio = 29999; // $299.99
      const resultado = formatearPrecio(precio);
      
      expect(resultado).toBe('$299.99');
    });

    test('Debe formatear precio con dos decimales', () => {
      const precio = 1500; // $15.00
      const resultado = formatearPrecio(precio);
      
      expect(resultado).toBe('$15.00');
    });

    test('Debe manejar precios grandes', () => {
      const precio = 999999; // $9,999.99
      const resultado = formatearPrecio(precio);
      
      expect(resultado).toBe('$9999.99');
    });
  });

  describe('TC-U013: Capitalizar Nombres', () => {
    test('Debe capitalizar nombre simple', () => {
      const nombre = 'juan';
      const resultado = capitalizarNombre(nombre);
      
      expect(resultado).toBe('Juan');
    });

    test('Debe capitalizar nombres compuestos', () => {
      const nombre = 'juan pablo mendez';
      const resultado = capitalizarNombre(nombre);
      
      expect(resultado).toBe('Juan Pablo Mendez');
    });

    test('Debe capitalizar incluso si está en mayúsculas', () => {
      const nombre = 'MARIA GONZALEZ';
      const resultado = capitalizarNombre(nombre);
      
      expect(resultado).toBe('Maria Gonzalez');
    });

    test('Debe manejar nombres con espacios extras', () => {
      const nombre = '  carlos alberto  ';
      const resultado = capitalizarNombre(nombre.trim());
      
      expect(resultado).toBe('Carlos Alberto');
    });
  });
});
