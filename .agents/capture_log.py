import sys
import json
import os
import re
from datetime import datetime

def parse_transcript(transcript_path):
    with open(transcript_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    turns = []
    current_prompt = None
    current_responses = []
    
    for line in lines:
        try:
            step = json.loads(line)
        except:
            continue
            
        if step.get("type") == "USER_INPUT":
            if current_prompt is not None:
                turns.append({
                    "prompt": current_prompt,
                    "response": current_responses[-1] if current_responses else None
                })
            current_prompt = step
            current_responses = []
            
        elif step.get("type") == "PLANNER_RESPONSE":
            if current_prompt is not None:
                content = step.get("content", "")
                if content:
                    current_responses.append(step)
                else:
                    # If empty content but has tool calls, we can either ignore or treat as empty
                    current_responses.append(step)

    if current_prompt is not None:
        turns.append({
            "prompt": current_prompt,
            "response": current_responses[-1] if current_responses else None
        })
        
    return turns

def main():
    try:
        # Read payload from stdin
        input_data = sys.stdin.read()
        if not input_data.strip():
            print(json.dumps({"decision": "continue", "reason": "No input"}))
            return
            
        payload = json.loads(input_data)
        
        transcript_path = payload.get("transcriptPath")
        workspace_paths = payload.get("workspacePaths", [])
        model_name = payload.get("modelName", "Gemini 3.1 Pro (High)")
        session_id = payload.get("conversationId", "unknown")
        
        if not transcript_path or not workspace_paths:
            print(json.dumps({"decision": "continue", "reason": "Missing paths"}))
            return
            
        repo_root = workspace_paths[0]
        log_dir = os.path.join(repo_root, ".agent-logs")
        os.makedirs(log_dir, exist_ok=True)
        
        turns = parse_transcript(transcript_path)
        if not turns:
            print(json.dumps({"decision": "continue", "reason": "No turns found"}))
            return
            
        first_prompt_time_str = turns[0]["prompt"].get("created_at", datetime.utcnow().isoformat() + "Z")
        last_prompt_time_str = turns[-1]["prompt"].get("created_at", first_prompt_time_str)
        
        # Parse datetime for filename
        # format: 2026-08-28T09:14:02.118Z or similar.
        try:
            dt = datetime.fromisoformat(first_prompt_time_str.replace("Z", "+00:00"))
            date_prefix = dt.strftime("%Y-%m-%d_%H-%M-%S")
            date_str = dt.strftime("%Y-%m-%d")
        except:
            dt = datetime.utcnow()
            date_prefix = dt.strftime("%Y-%m-%d_%H-%M-%S")
            date_str = dt.strftime("%Y-%m-%d")
            
        filename = f"{date_prefix}_{session_id[:8]}.md"
        filepath = os.path.join(log_dir, filename)
        
        # We need to construct the file content
        content = f"---" + "\n"
        content += f"session_id: {session_id}" + "\n"
        content += f"date: {date_str}" + "\n"
        # Since author is unknown, use placeholder or git user if possible, but let's just use 'user'
        content += f"author: user" + "\n"
        content += f"model: {model_name}" + "\n"
        content += f"tool: antigravity-ide" + "\n"
        content += f"project: {os.path.basename(repo_root)}" + "\n"
        content += f"total_exchanges: {len(turns)}" + "\n"
        content += f"first_prompt_time: {first_prompt_time_str}" + "\n"
        content += f"last_prompt_time: {last_prompt_time_str}" + "\n"
        content += f"---" + "\n\n"
        
        content += f"# Session Log - {date_str}" + "\n\n"
        content += f"Session: `{session_id[:8]}` | Project: `{os.path.basename(repo_root)}` | Author: `user`" + "\n\n"
        content += f"---" + "\n\n"
        
        for i, turn in enumerate(turns):
            num = i + 1
            prompt_step = turn["prompt"]
            response_step = turn["response"]
            
            p_time = prompt_step.get("created_at", "")
            p_content = prompt_step.get("content", "")
            
            content += f"[LOG_ENTRY type=PROMPT num={num} session={session_id[:8]}]" + "\n"
            content += f"timestamp: {p_time}" + "\n"
            content += f"model: {model_name}" + "\n\n"
            content += f"{p_content}" + "\n\n\n"
            
            if response_step:
                r_time = response_step.get("created_at", "")
                r_content = response_step.get("content", "")
                if not r_content:
                    # In case content is empty but it was a tool call or similar.
                    r_content = ""
            else:
                r_time = ""
                r_content = "(No response yet)"
                
            content += f"[LOG_ENTRY type=RESPONSE num={num} session={session_id[:8]}]" + "\n"
            content += f"timestamp: {r_time}" + "\n"
            content += f"model: {model_name}" + "\n\n"
            content += f"{r_content}" + "\n\n\n"
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
        # The stop hook must output: { "decision": "continue", "reason": "..." } or allow to stop.
        # Returning {} or {"decision": "stop"} allows it to stop normally.
        print(json.dumps({"decision": "stop"}))
        
    except Exception as e:
        # Failsafe
        print(json.dumps({"decision": "stop", "reason": f"Error: {str(e)}"}))

if __name__ == "__main__":
    main()
