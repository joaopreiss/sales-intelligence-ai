function BrandLogo({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 
        Símbolo Geométrico Minimalista B2B (Radar / Lente de Foco & Impulso):
        Uma lente circular vazada cortada por um vetor direcional de inteligência.
        Limpo, premium, sem ruído, estilo Linear/Stripe.
      */}
      {/* Arco orbital externo */}
      <circle
        cx="12"
        cy="12"
        r="8.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="40 14"
      />
      {/* Vetor de insight ascendente central */}
      <path
        d="M8.5 15.5L15.5 8.5M15.5 8.5H11M15.5 8.5V13"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default BrandLogo
