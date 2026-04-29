import {pgClient} from '../db'

export async function createTask(
    type : string,
    payload: Record<string, unknown>
){
    const query = `
    INSERT INTO tasks
    (type, payload, status)
    VALUES ($1, $2, 'queued')
    RETURNING *;
    `

    const result = await pgClient.query(query, [type, payload])

    return result.rows[0]
}

export async function getAllTasks() {
  const result = await pgClient.query(
    `SELECT * FROM tasks ORDER BY id`
  );

  return result.rows;
}

export async function getTaskById(id: number) {
  const query = `
    SELECT *
    FROM tasks
    WHERE id = $1
    LIMIT 1;
  `;

  const result = await pgClient.query(query, [id]);

  return result.rows[0];
}

// export async function claimNextTask(
//     workerId: string
// ){
//     const query = `
//     UPDATE tasks
//     SET status = 'running',
//         worker_id = $1,
//         attempts = attempts + 1
//     WHERE id = (
//         SELECT id FROM tasks
//         WHERE status = 'queued'
//         AND (
//             next_retry_at IS NULL OR
//             next_retry_at <= $2
//         )
//         ORDER BY id
//         LIMIT 1
//         FOR UPDATE SKIP LOCKED
//     )
//     RETURNING *;
//     `

//     const result = await pgClient.query(query, [workerId, Date.now()])
//     return result.rows[0]
// }

export async function completeTask(id: number){
    await pgClient.query(
        `UPDATE tasks 
        SET status = 'completed'
        WHERE id = $1`,
        [id]
    )
}

export async function retryTask(id: number,
    attempts: number, maxAttempts: number
){
    if(attempts >= maxAttempts){
        await pgClient.query(
            `UPDATE tasks
            SET status = 'dead-letter'
            WHERE id = $1`, [id]
        )
        return
    }

    const delay = attempts * 3000

    await pgClient.query(
        `UPDATE tasks
        SET status = 'queued',
            next_retry_at = $2
            WHERE id = $1`,
        [id, Date.now() + delay]
    )
}

export async function getMetrics(){
    const result = await pgClient.query(`
        SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status='queued') AS queued,
      COUNT(*) FILTER (WHERE status='running') AS running,
      COUNT(*) FILTER (WHERE status='completed') AS completed,
      COUNT(*) FILTER (WHERE status='dead-letter') AS dead_letter
    FROM tasks;`)

    return result.rows[0]
}