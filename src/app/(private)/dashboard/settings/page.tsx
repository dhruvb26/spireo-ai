import React from "react";
import { getServerAuthSession } from "@/server/auth";
import Settings from "@/components/settings";
import { checkAccess, checkValidity } from "@/app/actions/user";

const SettingsPage = async () => {
  const session = await getServerAuthSession();
  const hasAccess = (await checkAccess()) as boolean;
  const endsAt = (await checkValidity()) as Date;

  if (!session) {
    // Handle the case when there's no session (user is not authenticated)
    return <div>Please log in to view settings.</div>;
  }

  return <Settings user={session.user} hasAccess={hasAccess} endsAt={endsAt} />;
};

export default SettingsPage;
