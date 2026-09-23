import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function coverApiPlugin(): Plugin {
  return {
    name: 'cover-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/generate-cover', async (req, res) => {
        if (req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const body = bodyStr ? JSON.parse(bodyStr) : {};
              const apiKey = process.env.GEMINI_API_KEY;

              if (apiKey && body.prompt) {
                try {
                  let generatedImageUrl: string | null = null;

                  // 1. Primary endpoint specified by user: gemini-2.5-flash-image with temperature: 1.0
                  try {
                    const restRes = await fetch(
                      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
                      {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          contents: [{ parts: [{ text: body.prompt }] }],
                          generationConfig: {
                            temperature: 1.0,
                          },
                        }),
                      }
                    );

                    if (restRes && restRes.ok) {
                      const data = await restRes.json();
                      const imagePart = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
                      if (imagePart?.inlineData?.data) {
                        generatedImageUrl = `data:${imagePart.inlineData.mimeType || 'image/png'};base64,${imagePart.inlineData.data}`;
                      }
                    }
                  } catch (e) {
                    // Failover to secondary
                  }

                  // 2. Secondary fallback if needed
                  if (!generatedImageUrl) {
                    try {
                      const { GoogleGenAI } = await import('@google/genai');
                      const ai = new GoogleGenAI({
                        apiKey,
                        httpOptions: {
                          headers: {
                            'User-Agent': 'aistudio-build',
                          },
                        },
                      });

                      const aiResponse = await ai.models.generateContent({
                        model: 'gemini-3.1-flash-lite-image',
                        contents: {
                          parts: [{ text: body.prompt }],
                        },
                        config: {
                          imageConfig: {
                            aspectRatio: '3:4',
                          },
                        },
                      });

                      const parts = aiResponse.candidates?.[0]?.content?.parts || [];
                      for (const part of parts) {
                        if (part.inlineData && part.inlineData.data) {
                          generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
                          break;
                        }
                      }
                    } catch {
                      // Handled below
                    }
                  }

                  if (generatedImageUrl) {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(
                      JSON.stringify({
                        ok: true,
                        imageUrl: generatedImageUrl,
                        isAiGenerated: true,
                        subject: body.subject,
                      })
                    );
                    return;
                  }
                } catch {
                  // Fall through to fallback response
                }
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true, fallback: true }));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid payload' }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });

      server.middlewares.use('/api/process-photo', async (req, res) => {
        if (req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const body = bodyStr ? JSON.parse(bodyStr) : {};
              const apiKey = process.env.GEMINI_API_KEY;
              const photoDataUrl = body.image;
              const prompt = body.prompt;

              if (apiKey && photoDataUrl && prompt) {
                try {
                  const match = photoDataUrl.match(/^data:([^;]+);base64,(.+)$/);
                  if (match) {
                    const mimeType = match[1] || 'image/jpeg';
                    const base64Data = match[2];

                    let generatedImageUrl: string | null = null;

                    // 1. Try with @google/genai SDK (gemini-3.1-flash-image)
                    try {
                      const { GoogleGenAI } = await import('@google/genai');
                      const ai = new GoogleGenAI({
                        apiKey,
                        httpOptions: {
                          headers: {
                            'User-Agent': 'aistudio-build',
                          },
                        },
                      });

                      const aiResponse = await ai.models.generateContent({
                        model: 'gemini-3.1-flash-image',
                        contents: [
                          {
                            role: 'user',
                            parts: [
                              {
                                inlineData: {
                                  data: base64Data,
                                  mimeType,
                                },
                              },
                              {
                                text: prompt,
                              },
                            ],
                          },
                        ],
                        config: {
                          imageConfig: {
                            aspectRatio: '1:1',
                          },
                        },
                      });

                      const parts = aiResponse.candidates?.[0]?.content?.parts || [];
                      for (const part of parts) {
                        if (part.inlineData && part.inlineData.data) {
                          generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
                          break;
                        }
                      }
                    } catch {
                      // Handled by fallback below
                    }

                    // 2. Secondary fallback with gemini-3.1-flash-lite-image
                    if (!generatedImageUrl) {
                      try {
                        const { GoogleGenAI } = await import('@google/genai');
                        const ai = new GoogleGenAI({
                          apiKey,
                          httpOptions: {
                            headers: {
                              'User-Agent': 'aistudio-build',
                            },
                          },
                        });

                        const aiResponse = await ai.models.generateContent({
                          model: 'gemini-3.1-flash-lite-image',
                          contents: [
                            {
                              role: 'user',
                              parts: [
                                {
                                  inlineData: {
                                    data: base64Data,
                                    mimeType,
                                  },
                                },
                                {
                                  text: prompt,
                                },
                              ],
                            },
                          ],
                          config: {
                            imageConfig: {
                              aspectRatio: '1:1',
                            },
                          },
                        });

                        const parts = aiResponse.candidates?.[0]?.content?.parts || [];
                        for (const part of parts) {
                          if (part.inlineData && part.inlineData.data) {
                            generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
                            break;
                          }
                        }
                      } catch {
                        // Handled below
                      }
                    }

                    if (generatedImageUrl) {
                      res.setHeader('Content-Type', 'application/json');
                      res.end(
                        JSON.stringify({
                          ok: true,
                          imageUrl: generatedImageUrl,
                          isAiGenerated: true,
                        })
                      );
                      return;
                    }
                  }
                } catch {
                  // Fall through to fallback
                }
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true, fallback: true }));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid payload' }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), coverApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
