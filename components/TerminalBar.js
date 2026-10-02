export default function TerminalBar({command,status="OK",meta=""}) {
  return <div className="terminal-bar" aria-label={`Terminal command: ${command}`}>
    <div className="terminal-bar-left">
      <span className="terminal-prompt">krishna@studio:~$</span>
      <span className="terminal-command">{command}</span>
      <span className="terminal-cursor-block" aria-hidden="true">█</span>
    </div>
    <div className="terminal-bar-right">
      {meta && <span>{meta}</span>}
      <b>[{status}]</b>
    </div>
  </div>;
}
