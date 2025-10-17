import { useEffect, useRef } from "react";

/**
 * Renderiza <vapi-widget> y asegura que el script UMD esté cargado.
 * Props mínimas: assistantId, publicKey.
 * Puedes pasar ...rest para props/atributos extra si el widget los soporta.
 */
export function VapiWidgetEmbed({
  assistantId,
  publicKey,
  className,
  style,
  ...rest
}) {
  const ref = useRef(null);

  // Inyecta script UMD si no existe (por si lo quieres usar sin tocar index.html)
  useEffect(() => {
    const SRC = "https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js";
    if (!document.querySelector(`script[src="${SRC}"]`)) {
      const s = document.createElement("script");
      s.src = SRC;
      s.async = true;
      s.type = "text/javascript";
      document.body.appendChild(s);
    }
  }, []);

  // Actualiza atributos si cambian (por ejemplo, al alternar agente)
  useEffect(() => {
    if (!ref.current) return;
    if (assistantId) ref.current.setAttribute("assistant-id", assistantId);
    if (publicKey) ref.current.setAttribute("public-key", publicKey);
  }, [assistantId, publicKey]);

  // NOTA: Al desmontar el componente, el web component se limpia solo.
  return (
    <vapi-widget
      ref={ref}
      class={className}
      style={style}
      assistant-id={assistantId}
      public-key={publicKey}
      {...rest}
    />
  );
}
