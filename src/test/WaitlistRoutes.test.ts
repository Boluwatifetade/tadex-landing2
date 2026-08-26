import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as waitlistPost } from "@/app/api/waitlist/route";
import { POST as planWaitlistPost } from "@/app/api/plan-waitlist/route";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => {
  return {
    supabase: {
      from: vi.fn(),
    },
  };
});

describe("Waitlist API Routes", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("POST /api/waitlist", () => {
    it("returns 400 if email is missing or invalid", async () => {
      const req = new Request("http://localhost:3000/api/waitlist", {
        method: "POST",
        body: JSON.stringify({ email: "invalid-email" }),
      });

      const res = await waitlistPost(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe("Invalid email");
    });

    it("inserts into waitlist and returns 200 on success", async () => {
      const mockInsert = vi.fn().mockResolvedValueOnce({ error: null });
      vi.mocked(supabase.from).mockReturnValueOnce({
        insert: mockInsert,
      } as any);

      const req = new Request("http://localhost:3000/api/waitlist", {
        method: "POST",
        body: JSON.stringify({ email: "valid.user@tadexapp.com" }),
      });

      const res = await waitlistPost(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(mockInsert).toHaveBeenCalledWith({ email: "valid.user@tadexapp.com" });
    });
  });

  describe("POST /api/plan-waitlist", () => {
    it("returns 400 if email is invalid or plan is missing", async () => {
      const req = new Request("http://localhost:3000/api/plan-waitlist", {
        method: "POST",
        body: JSON.stringify({ email: "invalid", selectedPlan: "" }),
      });

      const res = await planWaitlistPost(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe("Valid email is required");
    });

    it("returns 409 if email is already registered", async () => {
      const mockSelect = vi.fn().mockResolvedValueOnce({
        data: null,
        error: { code: "23505", message: "duplicate key value violates unique constraint" },
      });
      const mockInsert = vi.fn().mockReturnValueOnce({ select: mockSelect });

      vi.mocked(supabase.from).mockReturnValueOnce({
        insert: mockInsert,
      } as any);

      const req = new Request("http://localhost:3000/api/plan-waitlist", {
        method: "POST",
        body: JSON.stringify({ email: "already@tadexapp.com", selectedPlan: "starter" }),
      });

      const res = await planWaitlistPost(req);
      expect(res.status).toBe(409);
      const json = await res.json();
      expect(json.error).toBe("This email is already registered for the waitlist");
    });

    it("inserts into plan_waitlist and returns 200 on success", async () => {
      const mockSelect = vi.fn().mockResolvedValueOnce({
        data: [{ id: 1, email: "new@tadexapp.com", selected_plan: "pro" }],
        error: null,
      });
      const mockInsert = vi.fn().mockReturnValueOnce({ select: mockSelect });

      vi.mocked(supabase.from).mockReturnValueOnce({
        insert: mockInsert,
      } as any);

      const req = new Request("http://localhost:3000/api/plan-waitlist", {
        method: "POST",
        body: JSON.stringify({
          email: "new@tadexapp.com",
          selectedPlan: "pro",
          eventVolume: "1000",
          currentTool: "manual",
        }),
      });

      const res = await planWaitlistPost(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.selected_plan).toBe("pro");
    });
  });
});
