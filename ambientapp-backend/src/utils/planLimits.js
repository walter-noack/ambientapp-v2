// backend/src/utils/planLimits.js
const FREE_MONTHLY_DIAGNOSTICS = 3; // o el número que definas

function initPlanInfoIfNeeded(user) {
  if (!user.planInfo) {
    user.planInfo = {
      plan: user.tipoSuscripcion === 'pro' ? 'Pro' : 'Free',
      diagnosticosTotales: user.tipoSuscripcion === 'pro' ? Infinity : FREE_MONTHLY_DIAGNOSTICS,
      diagnosticosRestantes: user.tipoSuscripcion === 'pro' ? Infinity : FREE_MONTHLY_DIAGNOSTICS,
      usuariosRestantes: 0,
      caracteristicas: [],
      features: user.features || {},
    };
  }
}

/**
 * Verifica si el usuario puede crear un nuevo diagnóstico según su plan.
 * Devuelve un objeto { allowed: boolean, reason?: string }
 */
function canCreateDiagnostic(user) {
  const tipo = user.tipoSuscripcion || 'free';

  if (tipo === 'pro') {
    // Pro sin límite (si tienes otra lógica, ajusta aquí)
    return { allowed: true };
  }

  initPlanInfoIfNeeded(user);

  const { diagnosticosTotales, diagnosticosRestantes } = user.planInfo;

  if (
    typeof diagnosticosTotales === 'number' &&
    typeof diagnosticosRestantes === 'number'
  ) {
    if (diagnosticosRestantes <= 0) {
      return {
        allowed: false,
        reason: 'Has alcanzado el límite de diagnósticos de tu plan actual.',
      };
    }
    return { allowed: true };
  }

  // Si no hay datos claros de plan, por seguridad podrías:
  // - bloquear: return { allowed: false, reason: 'No se ha configurado el plan del usuario.' };
  // - o permitir: (yo prefiero permitir de momento)
  return { allowed: true };
}

/**
 * Descuenta 1 diagnóstico del usuario (si aplica).
 * Debe llamarse SOLO después de crear el diagnóstico.
 */
async function consumeDiagnosticIfNeeded(user) {
  const tipo = user.tipoSuscripcion || 'free';

  if (tipo === 'pro') {
    // No consumimos nada si Pro no tiene límite
    return;
  }

  initPlanInfoIfNeeded(user);

  if (
    typeof user.planInfo.diagnosticosRestantes === 'number' &&
    user.planInfo.diagnosticosRestantes > 0
  ) {
    user.planInfo.diagnosticosRestantes -= 1;
    await user.save();
  }
}

module.exports = {
  canCreateDiagnostic,
  consumeDiagnosticIfNeeded,
};