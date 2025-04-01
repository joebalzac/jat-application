import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export type JobStatus =
  | "Wishlist"
  | "Applied"
  | "Interviewing"
  | "Offer"
  | "Rejected";

export interface Job {
  id: number;
  company: string;
  title: string;
  status: JobStatus;
  location: string;
  appliedDate: string;
  // tags: string[];
  notes: string;
}

const api = axios.create({
  baseURL: "http://localhost:4000",
});

const fetchJobs = async (): Promise<Job[]> => {
  const res = await api.get("/jobs");
  return res.data;
};

export const useJobs = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  });
};
