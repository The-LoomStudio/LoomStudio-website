import { useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, ChevronRight, Columns2, Copy, Download, Eye, FileText, Folder, FolderOpen, History, Maximize2, Plus, SlidersHorizontal, Trash2, Undo2, Upload } from 'lucide-react'
import { AssetWorkbenchLayout } from './snapshot/shared/ui/asset-workbench-layout/asset-workbench-layout.js'
import { FileTree } from './snapshot/shared/ui/file-tree/file-tree.js'
import { MarkdownContent } from './snapshot/shared/ui/markdown-content/markdown-content.js'
import { AgentChatPanel } from './snapshot/widgets/agent-chat-panel/agent-chat-panel.js'
import { createTranslator } from './snapshot/shared/i18n/index.js'
import { documents, files, initialMessages, profiles, providers, session } from './fixtures.js'
import './snapshot/styles/global.css'
import './studio-demo.css'

const t = createTranslator('zh-CN')
const codeBlockLabels = {
  copy: t('longTextEditor.copy'), copied: t('longTextEditor.copied'), copyFailed: t('longTextEditor.copyFailed'),
  enableWrap: t('markdown.code.enableWrap'), disableWrap: t('markdown.code.disableWrap'),
}

export default function StudioDemo() {
  const [revision, setRevision] = useState(0)
  return <section className="studio-demo-shell" aria-label="Studio 真实组件演示">
    <div className="studio-demo-controls">
      <div role="group" aria-label="选择演示">
        <button type="button" aria-pressed>工作区分栏</button>
      </div>
      <button type="button" onClick={() => setRevision(value => value + 1)}>重置演示</button>
    </div>
    <p className="studio-demo-caption">选择文件、展开目录，拖动分栏或切换浏览方式。工具执行记录会在需要时作为区分栏展示。所有改动仅保留在本次演示中。</p>
    <div id="studio-demo" key={revision}><WorkspaceDemo /></div>
  </section>
}

function WorkspaceDemo() {
  const [selected, setSelected] = useState('setting')
  const [expanded, setExpanded] = useState(['world'])
  const [width, setWidth] = useState(260)
  const [mode, setMode] = useState<'master-detail' | 'drilldown'>('master-detail')
  const [pane, setPane] = useState<'explorer' | 'detail'>('explorer')
  const [preview, setPreview] = useState(false)
  const [drafts, setDrafts] = useState(documents)
  const value = drafts[selected]
  const update = (value: string) => setDrafts(current => ({ ...current, [selected]: value }))
  return <div className="demo-workspace">
    <header className="demo-workspace-toolbar">
      <button type="button" className="demo-toolbar-icon" title="返回资源列表" onClick={() => setPane('explorer')}><ArrowLeft /></button>
      <button type="button" className="demo-toolbar-icon" title="进入所选资源" onClick={() => setPane('detail')}><ArrowRight /></button>
      <span className="demo-breadcrumb"><Folder />资源 <ChevronRight /> 银海纪行 <ChevronRight /> 设定</span>
      <button type="button" className="demo-toolbar-icon" title="切换分栏" onClick={() => setMode(mode === 'master-detail' ? 'drilldown' : 'master-detail')}><Columns2 /></button>
      <button type="button" className="demo-toolbar-icon" title="展开" onClick={() => setPane('detail')}><Maximize2 /></button>
    </header>
    <div className="demo-workspace-content">
      <AssetWorkbenchLayout
        explorerWidth={width} onExplorerWidthChange={setWidth} hasSelection={true} viewMode={mode}
        mobilePane={pane} onMobilePaneChange={setPane} resizeLabel="调整文件列表宽度"
        toolbar={<div className="demo-resource-actions"><button type="button" title="新增"><Plus /></button><button type="button" title="复制"><Copy /></button><button type="button" title="导入"><Upload /></button><button type="button" title="导出"><Download /></button><button type="button" title="删除"><Trash2 /></button></div>}
        explorer={<FileTree ariaLabel="演示文件" nodes={files} expandedIds={expanded} onExpandedIdsChange={setExpanded}
          selectedId={selected} onSelect={node => { setSelected(node.id); setPane('detail') }}
          getDisclosureLabel={(node, open) => `${open ? '收起' : '展开'}${node.label}`}
          getDragLabel={node => `拖动${node.label}`} moreActionsLabel="更多操作"
          renderIcon={(node, open) => node.children ? (open ? <FolderOpen /> : <Folder />) : <FileText />}
        />}
      >
        <div className="demo-document"><header className="demo-detail-header"><small>模块配置</small><div><h1>{selected === 'world' ? '银海纪行' : files[0].children!.find(file => file.id === selected)?.label}</h1><button type="button" title="资源属性"><SlidersHorizontal /></button></div><span>选择左侧资产后开始编辑。</span></header><section className="demo-editor"><header><b>说明</b><div><button type="button" title="预览" onClick={() => setPreview(!preview)}><Eye /></button><button type="button" title="恢复" onClick={() => update(documents[selected])}><Undo2 /></button><button type="button" title="历史" disabled><History /></button><button type="button" title="复制"><Copy /></button></div></header>{preview ? <MarkdownContent value={value} codeBlockLabels={codeBlockLabels} /> : <div className="demo-editor-input"><span className="demo-line-number">1</span><textarea value={value} onChange={event => update(event.target.value)} placeholder="在这里补充当前资产的说明与备注……" spellCheck={false} /></div>}</section></div>
      </AssetWorkbenchLayout>
    </div>
  </div>
}

function AgentDemo() {
  const [input, setInput] = useState('')
  const [profileId, setProfileId] = useState(profiles[0].id)
  const [messages, setMessages] = useState(initialMessages)
  function submit(event: FormEvent) {
    event.preventDefault()
    const content = input.trim()
    if (!content) return
    const sequence = messages.length + 1
    const createdAt = new Date().toISOString()
    setMessages([...messages,
      { id: `demo-entry-${sequence}`, agentSessionId: session.id, sequence, createdAt, entry: { kind: 'message', role: 'user', content } },
      { id: `demo-entry-${sequence + 1}`, agentSessionId: session.id, sequence: sequence + 1, createdAt, entry: {
        kind: 'message', role: 'assistant', content: profileId === profiles[0].id
          ? '**固定演示回复 · 叙事助手**\n\n伊芙将信折好，望向海雾中的灯塔。“等退潮，我们就出发。”\n\n这里仅展示消息交互，没有调用模型或推进真实故事。'
          : '**固定演示回复 · 世界设定助手**\n\n每次潮汐倒流，旧航海图就会出现新的标记。\n\n这里仅展示消息交互，没有调用模型或修改真实设定。',
      } },
    ])
    setInput('')
  }
  return <AgentChatPanel busy={false} input={input} messages={messages} profiles={profiles} providerAccounts={providers}
    selectedProfileId={profileId} session={{ ...session, agentProfileId: profileId, entryCount: messages.length }} t={t}
    onChangeInput={setInput} onSelectProfile={setProfileId} onSubmit={submit} />
}
