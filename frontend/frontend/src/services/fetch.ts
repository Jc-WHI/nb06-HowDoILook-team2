// ⬇️ 이 코드로 src/services/fetch.ts 파일의 logError 함수를 교체하세요.

const logError = async (response: Response) => {
    if (!response.ok) {
        let errorData: any = '에러 응답 본문을 파싱할 수 없습니다.' // 기본 에러 메시지
        try {
            // 1. JSON으로 파싱 시도
            errorData = await response.clone().json()
        } catch (jsonError) {
            try {
                // 2. JSON 파싱 실패 시, 텍스트로 파싱 시도
                errorData = await response.clone().text()
            } catch (textError) {
                // 텍스트 파싱도 실패하면 그냥 URL과 상태 코드만 남김
                console.error(`[프론트] ${response.url} ${response.status} (응답 본문 파싱 실패)`)
                return
            }
        }
        // 1번이나 2번이 성공하면, 여기서 상세 로그를 남김
        console.error(`[프론트] ${response.url} ${response.status}`, errorData)
    }
}

// ⬇️ enhancedFetch 함수는 그대로 둡니다.
const enhancedFetch: (
    url: Parameters<typeof fetch>[0],
    init?: Parameters<typeof fetch>[1] & { next?: { tags: string[] } },
) => ReturnType<typeof fetch> = async (url, init) => {
    let response: Response
    try {
        response = await fetch(url, init)
        if (!response.ok) {
            await logError(response) // 수정된 logError 함수가 호출됨
        }
    } catch (error) {
        console.error(error)
        throw error
    }

    return response
}

export default enhancedFetch