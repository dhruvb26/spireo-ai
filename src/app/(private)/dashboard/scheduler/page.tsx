import { getDrafts } from "@/actions/draft";
import Calendar from "../_components/calendar-component";
export const dynamic = "force-dynamic";
import { Draft } from "@/actions/draft";

interface GetDraftsResult {
  success: boolean;
  message: string;
  data: Draft[];
}

const SchedulerPage = async () => {
  let drafts: Draft[] = [];
  try {
    const result = (await getDrafts()) as GetDraftsResult;
    drafts = result.success ? result.data : [];
  } catch (error) {
    console.error("Error fetching drafts:", error);
  }

  return (
    <main>
      <div className="mb-4">
        <h1 className="text-xl font-semibold tracking-tight text-brand-gray-900">
          Post Scheduler
        </h1>
        <p className="text-sm text-brand-gray-500">
          Schedule your drafts for future publication with ease and efficiency.
        </p>
      </div>
      <Calendar drafts={drafts} />
    </main>
  );
};

export default SchedulerPage;
