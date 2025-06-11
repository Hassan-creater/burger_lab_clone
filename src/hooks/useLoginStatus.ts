import axios from "axios";

export async function useLoginStatus() {
  try {
    const response = await axios.get<{ status: boolean; error?: string }>(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/login_status`,
      {
        withCredentials: true,
      }
    );

    return {
      status: response.status,
      isLoggedIn: response.data.status,
    };
  } catch (error) {
    return {
      status: 500,
      isLoggedIn: false,
    };
  }
}
