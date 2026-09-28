"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { ContentItemForm } from "./ContentItemForm";
import {
  createContentItem,
  deleteContentItem,
  moveContentItem,
  updateContentItem,
} from "@/lib/controllers/contentItems";
import type { ContentItem, ContentItemInput } from "@/lib/cms-types";

export function ContentItemsEditor({
  pageSlug,
  sectionKey,
  sectionId,
  initialItems,
}: {
  pageSlug: string;
  sectionKey: string;
  sectionId: string;
  initialItems: ContentItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  // Which top-level item is currently getting a new sub-item added under it
  // (null = none). Sub-items are only relevant to sections that nest child
  // content, e.g. a discipline's list of conditions.
  const [addingChildFor, setAddingChildFor] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const topLevel = items.filter((item) => !item.parent_id);
  const childrenOf = (parentId: string) => items.filter((item) => item.parent_id === parentId);

  function handleFailure(message: string) {
    if (message.includes("signed in") || message.includes("admin access")) {
      router.push("/admin/login?next=" + encodeURIComponent(window.location.pathname));
      return;
    }
    setError(message);
  }

  async function handleCreate(parentId: string | null, input: ContentItemInput) {
    setError(null);
    const result = await createContentItem(pageSlug, sectionId, { ...input, parent_id: parentId });
    if (result.ok) {
      setItems((prev) => [...prev, result.data].sort((a, b) => a.order_index - b.order_index));
      setAdding(false);
      setAddingChildFor(null);
    } else {
      handleFailure(result.error);
    }
  }

  async function handleUpdate(id: string, input: ContentItemInput) {
    setError(null);
    const result = await updateContentItem(pageSlug, id, input);
    if (result.ok) {
      setItems((prev) => prev.map((item) => (item.id === id ? result.data : item)));
      setEditingId(null);
    } else {
      handleFailure(result.error);
    }
  }

  function handleDelete(id: string) {
    const childCount = childrenOf(id).length;
    const message =
      childCount > 0
        ? `Delete this item and its ${childCount} sub-item(s)? This cannot be undone.`
        : "Delete this item? This cannot be undone.";
    if (!confirm(message)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteContentItem(pageSlug, id);
      if (result.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id && item.parent_id !== id));
      } else {
        handleFailure(result.error);
      }
    });
  }

  function handleMove(id: string, direction: "up" | "down", siblingIds: string[]) {
    setError(null);
    startTransition(async () => {
      const result = await moveContentItem(pageSlug, id, direction, siblingIds);
      if (result.ok) {
        setItems((prev) => {
          const siblings = siblingIds
            .map((sid) => prev.find((item) => item.id === sid))
            .filter((item): item is ContentItem => Boolean(item));
          const index = siblings.findIndex((item) => item.id === id);
          const swapIndex = direction === "up" ? index - 1 : index + 1;
          if (index === -1 || swapIndex < 0 || swapIndex >= siblings.length) return prev;
          const a = siblings[index];
          const b = siblings[swapIndex];
          return prev
            .map((item) => {
              if (item.id === a.id) return { ...item, order_index: b.order_index };
              if (item.id === b.id) return { ...item, order_index: a.order_index };
              return item;
            })
            .sort((x, y) => x.order_index - y.order_index);
        });
      } else {
        handleFailure(result.error);
      }
    });
  }

  function renderRow(item: ContentItem, index: number, siblingIds: string[]) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-brand-900/10 bg-white/50 px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            disabled={index === 0 || isPending}
            onClick={() => handleMove(item.id, "up", siblingIds)}
            className="text-brand-700/60 hover:text-brand-forest disabled:opacity-30"
            aria-label="Move up"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            disabled={index === siblingIds.length - 1 || isPending}
            onClick={() => handleMove(item.id, "down", siblingIds)}
            className="text-brand-700/60 hover:text-brand-forest disabled:opacity-30"
            aria-label="Move down"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold text-brand-forest">
            {item.title_en || item.title_ar || item.text_en || item.text_ar || "(untitled)"}
          </div>
          <div className="truncate text-xs text-brand-800/60">
            {item.item_type} {item.icon ? `· ${item.icon}` : ""}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setEditingId(item.id)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-forest hover:bg-brand-100/60"
          aria-label="Edit"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => handleDelete(item.id)}
          disabled={isPending}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
          aria-label="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const topLevelIds = topLevel.map((item) => item.id);

  return (
    <div className="space-y-3">
      {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}
      {topLevel.map((item, index) => {
        const children = childrenOf(item.id);
        const childIds = children.map((c) => c.id);
        return (
          <div key={item.id} className="space-y-2">
            {editingId === item.id ? (
              <ContentItemForm
                pageSlug={pageSlug}
                sectionKey={sectionKey}
                item={item}
                onCancel={() => setEditingId(null)}
                onSubmit={(input) => handleUpdate(item.id, input)}
              />
            ) : (
              renderRow(item, index, topLevelIds)
            )}

            {children.length > 0 || addingChildFor === item.id ? (
              <div className="ms-8 space-y-2 border-s-2 border-brand-900/10 ps-4">
                {children.map((child, childIndex) =>
                  editingId === child.id ? (
                    <ContentItemForm
                      key={child.id}
                      pageSlug={pageSlug}
                      sectionKey={sectionKey}
                      item={child}
                      onCancel={() => setEditingId(null)}
                      onSubmit={(input) => handleUpdate(child.id, input)}
                    />
                  ) : (
                    <div key={child.id}>{renderRow(child, childIndex, childIds)}</div>
                  )
                )}

                {addingChildFor === item.id ? (
                  <ContentItemForm
                    pageSlug={pageSlug}
                    sectionKey={sectionKey}
                    item={null}
                    onCancel={() => setAddingChildFor(null)}
                    onSubmit={(input) => handleCreate(item.id, input)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setAddingChildFor(item.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-brand-forest hover:text-brand-gold"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add sub-item
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAddingChildFor(item.id)}
                className="ms-8 flex items-center gap-1.5 text-xs font-bold text-brand-700/60 hover:text-brand-gold"
              >
                <Plus className="h-3.5 w-3.5" /> Add sub-item
              </button>
            )}
          </div>
        );
      })}

      {adding ? (
        <ContentItemForm
          pageSlug={pageSlug}
          sectionKey={sectionKey}
          item={null}
          onCancel={() => setAdding(false)}
          onSubmit={(input) => handleCreate(null, input)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-900/20 py-3 text-sm font-bold text-brand-forest transition-colors hover:border-brand-gold hover:bg-brand-gold/5"
        >
          <Plus className="h-4 w-4" /> Add item
        </button>
      )}
    </div>
  );
}
