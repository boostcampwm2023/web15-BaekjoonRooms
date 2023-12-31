import { apiClient } from './apiClient';
import { ProblemType } from '../types/ProblemType';

export async function randomProblem(
  tagIds: number[],
  levels: number[],
  count: number,
): Promise<ProblemType[]> {
  const tagIdsQuery = tagIds.join(',');
  const levelIdsQuery = levels.join(',');
  try {
    const { data } = await apiClient.get(
      `/problem/random?tagIds=${tagIdsQuery}&levels=${levelIdsQuery}&count=${count}`,
    );
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('문제를 불러오는데 실패했습니다.');
  }
}
