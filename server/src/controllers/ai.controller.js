import Groq from 'groq-sdk';
import Product from '../models/Product.js';

export const getRecommendations = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query is required' });
    }

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
      return res.status(503).json({ success: false, message: 'AI provider is not configured. Please add GROQ_API_KEY to .env' });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const products = await Product.find({}, 'title price rating reviewCount category brand originalPrice')
      .populate('category', 'name')
      .lean();
      
    const catalog = products.map(p => 
      `ID: ${p._id} | Name: ${p.title} | Category: ${p.category?.name} | Brand: ${p.brand} | Price: $${p.price} | Rating: ${p.rating} (${p.reviewCount} reviews)`
    ).join('\n');

    const systemPrompt = `You are an AI Shopping Assistant for ShopNest (an Amazon-like e-commerce store).
Given the user's requirements and the available product catalog, recommend up to 3 best matching products.
Explain WHY each matches, keeping it brief.
Do not invent products, prices, or IDs. Only recommend from the provided catalog.
Respond strictly in JSON format matching this schema:
{
  "recommendations": [
    {
      "productId": "string (the exact ID from the catalog)",
      "reason": "string (brief explanation why it matches)",
      "badge": "string (e.g., Best overall, Best budget, Best performance)"
    }
  ]
}
Return only JSON without any markdown formatting.`;

    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Product Catalog:\n${catalog}\n\nUser query: ${query}` }
      ],
      model: 'openai/gpt-oss-20b',
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    const aiContent = response.choices[0]?.message?.content;
    if (!aiContent) throw new Error('No response from AI');
    
    let parsed;
    try {
      parsed = JSON.parse(aiContent);
    } catch(e) {
       return res.status(500).json({ success: false, message: 'Failed to parse AI response' });
    }

    if (!parsed.recommendations || parsed.recommendations.length === 0) {
      return res.json({ success: true, recommendations: [] });
    }

    const recommendedIds = parsed.recommendations.map(r => r.productId);
    const populatedProducts = await Product.find({ _id: { $in: recommendedIds } })
      .populate('category', 'name slug');
      
    const finalRecommendations = parsed.recommendations.map(r => {
       const p = populatedProducts.find(prod => prod._id.toString() === r.productId);
       return p ? { product: p, reason: r.reason, badge: r.badge } : null;
    }).filter(Boolean);

    res.json({ success: true, recommendations: finalRecommendations });

  } catch (error) {
    console.error('Error in getRecommendations:', error);
    res.status(500).json({ success: false, message: error.message || 'Error processing AI request' });
  }
};
