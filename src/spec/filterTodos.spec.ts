import { describe, it, expect } from "vitest";
import { filterByName, filterByPriority } from "@/stores/filterTodos";

// テスト用のダミーデータ
const todos = [
  { id: 1, name: "買い物", content: "", priority: 1, status: 2, progress: 0, limit: "2025-01-01", created_at: "2025-01-01" },
  { id: 2, name: "買い出し", content: "", priority: 2, status: 1, progress: 0, limit: "2025-01-01", created_at: "2025-01-01" },
  { id: 3, name: "勉強", content: "", priority: 3, status: 3, progress: 0, limit: "2025-01-01", created_at: "2025-01-01" },
];

describe("filterByName", () => {
  it("検索語を含むタスクだけ返す", () => {
    const result = filterByName(todos, "買");
    expect(result.length).toBe(2);
    expect(result[0].name).toBe("買い物");
  });

  it("検索語が空なら全件返す", () => {
    const result = filterByName(todos, "");
    expect(result.length).toBe(3);
  });

  it("一致するものがなければ空配列を返す", () => {
    const result = filterByName(todos, "存在しない");
    expect(result.length).toBe(0);
  });
});

describe("filterByPriority", () => {
  it("指定した優先度のタスクだけ返す", () => {
    const result = filterByPriority(todos, 1);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe("買い物");
  });
});