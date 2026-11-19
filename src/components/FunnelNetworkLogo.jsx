function FunnelNetworkLogo({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Linhas conectando os nós da rede neural ao funil / seta */}
      <path
        d="M3 6L7.5 9.5M3 12L7.5 9.5M3 12L7.5 14.5M3 18L7.5 14.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M7.5 9.5H12M7.5 14.5H12M7.5 9.5L12 12M7.5 14.5L12 12"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* Feixe convergente fluindo para a seta */}
      <path
        d="M12 9.5L16 11.5M12 12H16M12 14.5L16 12.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      
      {/* Seta direcional do funil (vazada) */}
      <path
        d="M15 8.5L21.5 12L15 15.5L16.8 12L15 8.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Nós da rede (pontos vazados com centro transparente) */}
      {/* Coluna 1 */}
      <circle cx="3" cy="6" r="1.3" fill="currentColor" />
      <circle cx="3" cy="12" r="1.3" fill="currentColor" />
      <circle cx="3" cy="18" r="1.3" fill="currentColor" />

      {/* Coluna 2 */}
      <circle cx="7.5" cy="9.5" r="1.4" fill="currentColor" />
      <circle cx="7.5" cy="14.5" r="1.4" fill="currentColor" />

      {/* Coluna 3 */}
      <circle cx="12" cy="9.5" r="1.3" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="14.5" r="1.3" fill="currentColor" />
    </svg>
  )
}

export default FunnelNetworkLogo

