import { Fragment, useId, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, LayoutGroup, domMax, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { ArrowDownToLine, Check, ChevronRight, Copy, GitBranch, Hexagon, LoaderCircle, Terminal } from 'lucide-react'
import SiteMotion from '../motion/SiteMotion'
import type { SiteLocale } from '../../lib/i18n'
import { downloadCopy, operations } from './download-copy'
import './download-console.css'

// These are the fixed, unquoted setup commands above, not arbitrary shell input.
function ShellCommand({ command }: { command: string }) {
  let word = 0
  return command.split(/(\s+)/).map((token, index) => {
    if (/^\s+$/.test(token)) return token
    const position = word++
    const kind = position === 0 || token === 'pnpm' ? 'command'
      : token.startsWith('https://') ? 'url'
      : token.startsWith('--') ? 'flag'
      : command.startsWith('cd ') ? 'path'
      : 'argument'
    if (kind === 'flag' && token.includes('=')) {
      const separator = token.indexOf('=')
      return <Fragment key={index}><span className="shell-flag">{token.slice(0, separator + 1)}</span><span className="shell-value">{token.slice(separator + 1)}</span></Fragment>
    }
    return <span key={index} className={`shell-${kind}`}>{token}</span>
  })
}

export default function DownloadConsole({ locale = 'zh-CN' }: { locale?: SiteLocale }) {
  const text = downloadCopy[locale]
  const layoutId = useId()
  const [mode, setMode] = useState(0)
  const [platform, setPlatform] = useState(0)
  const [step, setStep] = useState(0)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')
  const [copying, setCopying] = useState(false)
  const generation = useRef(0)
  const tabs = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const transition = { duration: reducedMotion ? 0 : 0.2 }

  function selectMode(index: number) {
    if (index === mode) return
    generation.current++
    setMode(index); setStep(0); setCopyState('idle')
  }
  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    const next = event.key === 'ArrowRight' ? (mode + 1) % 3 : event.key === 'ArrowLeft' ? (mode + 2) % 3
      : event.key === 'Home' ? 0 : event.key === 'End' ? 2 : undefined
    if (next === undefined) return
    event.preventDefault(); selectMode(next)
    tabs.current!.querySelectorAll<HTMLButtonElement>('[role=tab]')[next].focus()
  }
  async function copy() {
    const request = ++generation.current
    setCopying(true); setCopyState('idle')
    try {
      await navigator.clipboard.writeText(operations[mode].join('\n'))
      if (request === generation.current) setCopyState('copied')
    } catch {
      if (request === generation.current) setCopyState('error')
    } finally {
      setCopying(false)
    }
  }

  return <SiteMotion features={domMax}><LayoutGroup id={layoutId}>
    <section className="install-console" id="download-console" aria-label={text.title}>
      <header className="install-console__header">
        <span className="install-console__dots" aria-hidden="true"><i /><i /><i /></span>
        <span><Terminal size={15} aria-hidden="true" />{['PowerShell', 'zsh', 'bash'][platform]}<span className="install-console__project"> / LoomStudio</span></span>
        <span className="install-console__source">LOCAL SETUP</span>
      </header>
      <div ref={tabs} className="install-modes" role="tablist" aria-label={text.modeLabel} onKeyDown={navigate}>
        {text.modes.map((label, index) => <button key={index} type="button" role="tab" id={`${layoutId}-tab-${index}`}
          aria-selected={mode === index} aria-controls={`${layoutId}-panel`} tabIndex={mode === index ? 0 : -1}
          onClick={() => selectMode(index)}>
          {mode === index && <m.span layoutId="mode" className="install-mode-highlight" aria-hidden="true"
            transition={{ type: 'spring', stiffness: 360, damping: 32 }} />}
          <small>0{index + 1}</small>{label}
        </button>)}
      </div>
      <div className="install-platforms" role="group" aria-label={text.platform}>
        {['Windows', 'macOS', 'Linux'].map((label, index) => <m.button key={label} type="button"
          aria-pressed={platform === index} whileTap={reducedMotion ? undefined : { scale: 0.96 }} onClick={() => setPlatform(index)}>{label}</m.button>)}
      </div>
      <m.div layout className="install-console__body" role="tabpanel" id={`${layoutId}-panel`} aria-labelledby={`${layoutId}-tab-${mode}`}>
        <AnimatePresence mode="wait" initial={false}>
          <m.div key={mode} initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={transition}>
            <p className="install-context">{text.contexts[mode]}</p>
            <div className="install-code">
              <div className="install-prompt-context" aria-hidden="true">
                <span className="install-prompt-directory">{mode === 0 ? '~' : platform === 0 ? '~\\LoomStudio' : '~/LoomStudio'}</span>
                {mode !== 0 && <><span className="install-prompt-word">on</span><span className="install-prompt-branch"><GitBranch size={12} />main</span>
                  <span className="install-prompt-word">via</span><span className="install-prompt-runtime"><Hexagon size={12} />Node.js</span></>}
              </div>
              {operations[mode].map((line, index) => <div className="install-command" data-active={step === index} key={line}>
                  <div className="install-command__input">
                    <span className="install-prompt-character" aria-hidden="true">❯</span>
                    <pre><code><ShellCommand command={line} /></code>{step === index && <m.span layoutId={`cursor-${mode}`} className="install-terminal-cursor" aria-hidden="true" transition={transition} />}</pre>
                  </div>
                </div>
              )}
            </div>
          </m.div>
        </AnimatePresence>
        <div className="install-copy-row">
          <span className="install-copy-status" role="status" aria-live="polite" data-state={copyState}>
            {copying ? text.copying : copyState === 'copied' ? text.success : copyState === 'error' ? text.error : text.ready}
          </span>
          <m.button type="button" className="install-copy" disabled={copying} onClick={() => void copy()}
            whileHover={reducedMotion ? undefined : { y: -2 }} whileTap={reducedMotion ? undefined : { scale: 0.97 }}>
            <AnimatePresence mode="wait" initial={false}>
              <m.span key={copying ? 'copying' : copyState} aria-hidden="true" initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
                {copying ? <LoaderCircle size={16} /> : copyState === 'copied' ? <Check size={16} /> : <Copy size={16} />}
              </m.span>
            </AnimatePresence>
            {copying ? text.copying : copyState === 'copied' ? text.copied : copyState === 'error' ? text.failed : text.copy}
          </m.button>
        </div>
      </m.div>
    </section>
    <div className="install-walkthrough">
      <span className="install-walkthrough__caption">{text.select}</span>
      <div className="install-step-tabs" role="group" aria-label={text.select}>
        {text.names[mode].map((name, index) => <button key={index} type="button" aria-pressed={step === index} onClick={() => setStep(index)}>
          <span>0{index + 1}</span>{name}<ChevronRight size={13} aria-hidden="true" />
        </button>)}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <m.p className="install-step-help" key={`${mode}-${step}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
          {text.help[mode][step]}
        </m.p>
      </AnimatePresence>
      <p className="install-platform-tip">{text.tips[platform]}</p>
    </div>
    <footer className="install-console__footer"><ArrowDownToLine size={14} aria-hidden="true" /><span>{text.footer}</span></footer>
    <p className="install-availability">{text.hint}</p>
    <noscript><div className="install-noscript">
      {operations.slice(1).map((lines, index) => <section key={index}>
        <h3>{text.modes[index + 1]}</h3><p>{text.contexts[index + 1]}</p><pre><code>{lines.join('\n')}</code></pre>
      </section>)}
    </div></noscript>
  </LayoutGroup></SiteMotion>
}
