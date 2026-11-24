import { Toaster } from "sonner";
import { color } from "@/lib/theme";
import Layout from "@/components/layout";
import Home from "@/pages/home";

export default function App() {
  return (
    <Layout>
      <Home />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#161E2E",
            border: "1px solid #1E2A3B",
            color: "#F0F4F8",
          },
        }}
      />
    </Layout>
  );
}
