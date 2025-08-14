use anyhow::Result;
use rand::Rng;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LLMResponse {
    pub text: String,
    pub tokens_used: u32,
    pub emotion: String,
}

pub struct SimpleLLM {
    model_loaded: bool,
    responses: HashMap<String, Vec<String>>,
}

impl SimpleLLM {
    pub fn new() -> Self {
        println!("SimpleLLM: 初期化中...");

        let mut responses = HashMap::new();

        responses.insert(
            "greeting".to_string(),
            vec![
                "こんにちは！こうはどんなお手伝いができますか？".to_string(),
                "やあ！何かお困りのことはありますか？".to_string(),
                "こんにちは！プログラミングのお手伝いをしますよ！".to_string(),
            ],
        );

        responses.insert(
            "programming".to_string(),
            vec![
                "プログラミングについてですね！どの言語について知りたいですか？".to_string(),
                "コーディングのお手伝いをしますよ！具体的に何を作りたいですか？".to_string(),
                "プログラミングは楽しいですよね！何か作ってみましょう！".to_string(),
            ],
        );

        responses.insert(
            "help".to_string(),
            vec![
                "もちろんお手伝いします！何について知りたいですか？".to_string(),
                "お任せください！一緒に解決しましょう！".to_string(),
                "どんなことでも聞いてくださいね！".to_string(),
            ],
        );

        Self {
            model_loaded: true,
            responses,
        }
    }

    pub async fn generate(&self, prompt: &str) -> Result<LLMResponse> {
        println!("SimpleLLM: プロンプト受信: {}", prompt);

        // 簡単なキーワード検出
        let prompt_lower = prompt.to_lowercase();
        let mut emotion = "neutral";

        let response_text = if prompt_lower.contains("こんにちは")
            || prompt_lower.contains("hello")
            || prompt_lower.contains("やあ")
        {
            emotion = "happy";
            self.get_random_response("greeting")
        } else if prompt_lower.contains("プログラ")
            || prompt_lower.contains("コード")
            || prompt_lower.contains("rust")
            || prompt_lower.contains("開発")
        {
            emotion = "excited";
            self.get_random_response("programming")
        } else if prompt_lower.contains("助け")
            || prompt_lower.contains("help")
            || prompt_lower.contains("教え")
        {
            emotion = "helpful";
            self.get_random_response("help")
        } else {
            emotion = "thinking";
            format!("「{}」について考えています... 興味深い質問ですね！", prompt)
        };

        // 少し遅延を入れて本物のLLMっぽく
        tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;

        Ok(LLMResponse {
            text: response_text,
            tokens_used: prompt.len() as u32 + 50,
            emotion: emotion.to_string(),
        })
    }

    fn get_random_response(&self, category: &str) -> String {
        if let Some(responses) = self.responses.get(category) {
            let mut rng = rand::thread_rng();
            let index = rng.gen_range(0..responses.len());
            responses[index].clone()
        } else {
            "すみません、よく分かりませんでした。".to_string()
        }
    }

    pub fn is_loaded(&self) -> bool {
        self.model_loaded
    }
}
