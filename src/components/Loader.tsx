interface LoaderProps {
  text?: string
}

// הודעת טעינה. אפשר להעביר טקסט אחר, ברירת המחדל היא "Loading…"
function Loader({ text = 'Loading…' }: LoaderProps) {
  return (
    <p className="status-message" role="status">
      {text}
    </p>
  )
}

export default Loader
