import React, { useRef, useEffect } from "react";

/**
 * Простой редактор с форматированием без react-quill (совместим с React 19).
 * Использует contentEditable + document.execCommand для кнопок.
 */
const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const next = value ?? "";
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (el.innerHTML !== next) {
      el.innerHTML = next;
    }
  }, [value]);

  const handleInput = () => {
    const el = editorRef.current;
    if (!el) return;
    isInternalChange.current = true;
    onChange(el.innerHTML);
  };

  const exec = (cmd, value = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    handleInput();
  };

  const addLink = () => {
    const url = prompt("Введите URL ссылки:", "https://");
    if (url) exec("createLink", url);
  };

  const setTextColor = (hex) => {
    exec("foreColor", hex);
  };

  return (
    <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50 items-center">
        <button type="button" onClick={() => exec("bold")} className="px-2 py-1 rounded hover:bg-gray-200 font-bold" title="Жирный">Ж</button>
        <button type="button" onClick={() => exec("italic")} className="px-2 py-1 rounded hover:bg-gray-200 italic" title="Курсив">К</button>
        <button type="button" onClick={() => exec("underline")} className="px-2 py-1 rounded hover:bg-gray-200 underline" title="Подчёркивание">Ч</button>
        <button type="button" onClick={() => exec("insertUnorderedList")} className="px-2 py-1 rounded hover:bg-gray-200" title="Маркированный список">•</button>
        <button type="button" onClick={() => exec("insertOrderedList")} className="px-2 py-1 rounded hover:bg-gray-200" title="Нумерованный список">1.</button>
        <button type="button" onClick={addLink} className="px-2 py-1 rounded hover:bg-gray-200" title="Ссылка">🔗</button>
        <span className="text-gray-500 text-sm ml-1 mr-0.5">Цвет:</span>
        <button type="button" onClick={() => setTextColor("#000000")} className="px-2 py-1 rounded hover:bg-gray-200 border border-gray-300 bg-white" title="Чёрный текст">А</button>
        <button type="button" onClick={() => setTextColor("#ffffff")} className="px-2 py-1 rounded hover:bg-gray-200 border border-gray-300 bg-gray-800 text-white" title="Белый текст">А</button>
        <input type="color" defaultValue="#000000" onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border border-gray-300" title="Любой цвет текста" />
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[200px] p-4 outline-none text-gray-800 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-[#0b3b2e] [&_a]:underline"
        onInput={handleInput}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
      <style>{`
        [contenteditable]:empty:before { content: attr(data-placeholder); color: #9ca3af; }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
