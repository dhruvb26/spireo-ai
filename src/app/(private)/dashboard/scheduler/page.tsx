import { getDrafts } from "@/actions/draft";
import Calendar, { Draft } from "../_components/calendar-component";

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
      <Calendar drafts={drafts} />
    </main>
  );
};

export default SchedulerPage;
